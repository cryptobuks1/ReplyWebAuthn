<?php declare(strict_types=1);

namespace Reply\WebAuthn\Controller;

use Base64Url\Base64Url;
use Reply\WebAuthn\Bridge\PublicKeyCredentialSourceRepository;
use Reply\WebAuthn\Bridge\EntityConverter;
use Reply\WebAuthn\Bridge\PublicKeyCredentialSource;
use Reply\WebAuthn\Bridge\PublicKeyCredentialCreationOptionsFactory;
use Reply\WebAuthn\Page\Account\Credential\AccountCredentialPageLoader;
use Shopware\Core\Checkout\Cart\Exception\CustomerNotLoggedInException;
use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Bridge\PsrHttpMessage\HttpMessageFactoryInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Webauthn\AuthenticatorAttestationResponse;
use Webauthn\AuthenticatorAttestationResponseValidator;
use Webauthn\PublicKeyCredentialCreationOptions;
use Webauthn\PublicKeyCredentialLoader;
use Webauthn\PublicKeyCredentialRpEntity;

/**
 * @RouteScope(scopes={"storefront"})
 */
class AccountCredentialController extends AbstractController
{
    private const CREATION_OPTIONS_SESSION_KEY = 'WebAuthnCredentialCreationOptions';

    /**
     * @var AccountCredentialPageLoader
     */
    private $pageLoader;

    /**
     * @var PublicKeyCredentialCreationOptionsFactory
     */
    private $creationOptionsFactory;

    /**
     * @var PublicKeyCredentialSourceRepository
     */
    private $credentialRepository;

    /**
     * @var PublicKeyCredentialLoader
     */
    private $credentialLoader;

    /**
     * @var AuthenticatorAttestationResponseValidator
     */
    private $authenticatorAttestationResponseValidator;

    /**
     * @var HttpMessageFactoryInterface
     */
    private $httpMessageFactory;

    /**
     * @param AccountCredentialPageLoader $pageLoader
     * @param PublicKeyCredentialCreationOptionsFactory $creationOptionsFactory
     * @param PublicKeyCredentialSourceRepository $credentialRepository
     * @param PublicKeyCredentialLoader $credentialLoader
     * @param AuthenticatorAttestationResponseValidator $authenticatorAttestationResponseValidator
     * @param HttpMessageFactoryInterface $httpMessageFactory
     */
    public function __construct(
        AccountCredentialPageLoader $pageLoader,
        PublicKeyCredentialCreationOptionsFactory $creationOptionsFactory,
        PublicKeyCredentialSourceRepository $credentialRepository,
        PublicKeyCredentialLoader $credentialLoader,
        AuthenticatorAttestationResponseValidator $authenticatorAttestationResponseValidator,
        HttpMessageFactoryInterface $httpMessageFactory
    ) {
        $this->pageLoader = $pageLoader;
        $this->creationOptionsFactory = $creationOptionsFactory;
        $this->credentialRepository = $credentialRepository;
        $this->credentialLoader = $credentialLoader;
        $this->authenticatorAttestationResponseValidator = $authenticatorAttestationResponseValidator;
        $this->httpMessageFactory = $httpMessageFactory;
    }

    /**
     * @Route("/account/credential", name="frontend.account.credential.page", options={"seo"="false"}, methods={"GET"})
     *
     * @throws CustomerNotLoggedInException
     */
    public function overviewPage(Request $request, SalesChannelContext $context): Response
    {
        $this->denyAccessUnlessLoggedIn();

        $page = $this->pageLoader->load($request, $context);

        return $this->renderStorefront('@ReplyWebAuthn/storefront/page/account/credential/index.html.twig', ['page' => $page]);
    }

    /**
     * @Route("/account/webauthn/credential/creation-options", name="frontend.account.webauthn.credential.creation-options", options={"seo"="false"}, methods={"POST"}, defaults={"csrf_protected"=false, "XmlHttpRequest"=true})
     */
    public function creationOptions(SalesChannelContext $context, Request $request): Response
    {
        $this->denyAccessUnlessLoggedIn();

        $userEntity = EntityConverter::toUserEntity($context->getCustomer());

        $existingCredentials = [];
        foreach ($this->credentialRepository->findAllForUserEntity($userEntity) as $credentialSource) {
            $existingCredentials[] = $credentialSource->getPublicKeyCredentialDescriptor();
        }

        $options = $this->creationOptionsFactory->create($this->getRpEntity($request), $userEntity, $existingCredentials);

        $request->getSession()->set(self::CREATION_OPTIONS_SESSION_KEY, json_encode($options));

        return new JsonResponse($options);
    }

    /**
     * @Route("/account/webauthn/credential/save", name="frontend.account.webauthn.credential.save", options={"seo"="false"}, methods={"POST"}, defaults={"csrf_protected"=false, "XmlHttpRequest"=true})
     */
    public function save(Request $request): JsonResponse
    {
        $this->denyAccessUnlessLoggedIn();

        $credentialName = $request->request->get('name');
        if (!is_string($credentialName) || $credentialName === '') {
            return $this->createErrorResponse('Missing or invalid request parameter "name"');
        }

        $credential = $this->credentialLoader->loadArray($request->request->all());
        if (strlen($credential->getRawId()) > 255) {
            return $this->createErrorResponse('Credential ID exceeds maximum length of 255 bytes');
        }

        $response = $credential->getResponse();
        if (!$response instanceof AuthenticatorAttestationResponse) {
            return $this->createErrorResponse('Authenticator response does not contain attestation.');
        }

        $creationOptionsJson = $request->getSession()->get(self::CREATION_OPTIONS_SESSION_KEY);
        if (!is_string($creationOptionsJson)) {
            return $this->createErrorResponse('Saving credential has not been initialized properly.');
        }

        /** @var PublicKeyCredentialCreationOptions $creationOptions */
        $creationOptions = PublicKeyCredentialCreationOptions::createFromString($creationOptionsJson);
        $psrRequest = $this->httpMessageFactory->createRequest($request);
        $credentialSource = $this->authenticatorAttestationResponseValidator->check($response, $creationOptions, $psrRequest);

        $entity = PublicKeyCredentialSource::createFromBase($credentialSource);
        $entity->setName($credentialName);

        $this->credentialRepository->saveCredentialSource($entity);
        $request->getSession()->remove(self::CREATION_OPTIONS_SESSION_KEY);

        return new JsonResponse();
    }

    /**
     * @Route("/account/webauthn/credential/delete/{credentialId}", name="frontend.account.webauthn.credential.delete.one", options={"csrf_protected"=true, "seo"="false"}, methods={"POST"})
     */
    public function deleteOne(string $credentialId, SalesChannelContext $salesChannelContext): Response
    {
        $this->denyAccessUnlessLoggedIn();

        $credentialId = Base64Url::decode($credentialId);
        $credential = $this->credentialRepository->findOneByCredentialId($credentialId);
        if ($credential !== null && bin2hex($credential->getUserHandle()) === $salesChannelContext->getCustomer()->getId()) {
            $this->credentialRepository->deleteById($credentialId);
        }

        return $this->redirectToRoute('frontend.account.credential.page');
    }

    /**
     * @Route("/widgets/account/webauthn/credential/creation-modal", name="frontend.account.webauthn.credential.creation-modal", options={"csrf_protected"=false, "seo"=false}, methods={"GET"}, defaults={"XmlHttpRequest"=true})
     */
    public function renderCreationModal(): Response
    {
        $this->denyAccessUnlessLoggedIn();

        return $this->renderStorefront('@ReplyWebAuthn/storefront/component/account/credential-creation-modal.html.twig');
    }

    /**
     * @param Request $request
     * @return PublicKeyCredentialRpEntity
     */
    private function getRpEntity(Request $request): PublicKeyCredentialRpEntity
    {
        $host = $request->getHost();

        return new PublicKeyCredentialRpEntity(
            $host,
            $host,
            null
        );
    }
}
