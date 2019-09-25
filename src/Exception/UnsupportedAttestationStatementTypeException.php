<?php declare(strict_types=1);

namespace Reply\WebAuthn\Exception;

use Shopware\Core\Framework\ShopwareHttpException;

class UnsupportedAttestationStatementTypeException extends ShopwareHttpException
{
    public function __construct(string $type)
    {
        parent::__construct('{{ type }} is not a supported attestation statement type', ['type' => $type]);
    }

    public function getErrorCode(): string
    {
        return 'WEBAUTHN__UNSUPPORTED_ATTESTATION_STATEMENT_TYPE';
    }
}
