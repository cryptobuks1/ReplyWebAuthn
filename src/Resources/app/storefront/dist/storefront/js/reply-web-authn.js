(window.webpackJsonp=window.webpackJsonp||[]).push([["reply-web-authn"],{YOW1:function(e,t,n){"use strict";n.r(t);var r=n("FGIj"),o=n("k8s9");function i(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var s=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,r;return t=e,r=[{key:"base64UrlDecode",value:function(e){return window.atob(e.replace(/_/g,"/").replace(/-/g,"+"))}},{key:"base64Decode",value:function(e){return window.atob(e)}},{key:"arrayToBase64String",value:function(e){return window.btoa(String.fromCharCode.apply(String,i(e)))}},{key:"toByteArray",value:function(e){return Uint8Array.from(e,(function(e){return e.charCodeAt(0)}))}}],(n=null)&&a(t.prototype,n),r&&a(t,r),e}(),u=n("3xtq"),c=n("2Jwc"),l=n("gHbT");function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function p(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var h,g,v,w=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),p(this,d(t).apply(this,arguments))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(t,e),n=t,(r=[{key:"init",value:function(){if(this._button=this.el,!this._button)throw new Error("No button found for the plugin: ".concat(this.constructor.name));this._client=new o.a(window.accessKey,window.contextToken),this._registerEvents()}},{key:"_registerEvents",value:function(){this._button.addEventListener("click",this._getOptions.bind(this))}},{key:"_getOptions",value:function(){u.a.create(),this._sendRequest(this.options.initUrl,{},this._createCredential.bind(this))}},{key:"_createCredential",value:function(e){var t=this._convertOptions(e);console.log("Requesting new credential from authenticator",t),navigator.credentials.create({publicKey:t}).then(this._loadModal.bind(this),(function(e){u.a.remove(),console.log(e.toString())}))}},{key:"_loadModal",value:function(e){var t=this,n=this._convertAuthenticatorData(e);this._client.get(this.options.modalUrl,(function(e){u.a.remove();var r=new c.a(e);r.open(t._onModalOpen.bind(t,r,n))}))}},{key:"_onModalOpen",value:function(e,t){var n=this,r=l.a.querySelector(e.getModal(),"form",!1),o=l.a.querySelector(e.getModal(),"input",!1);o.focus(),r.addEventListener("submit",(function(r){r.preventDefault(),u.a.create(),t.name=o.value,n._saveCredential(t),e.close()})),r.addEventListener("reset",(function(){e.close()}))}},{key:"_saveCredential",value:function(e){console.log("Sending credential to server",e),this._sendRequest(this.options.saveUrl,e,(function(){window.location.reload()}))}},{key:"_sendRequest",value:function(e,t,n){var r=this._client.post(e,JSON.stringify(t),(function(){}));r.addEventListener("loadend",(function(){200===r.status&&n(JSON.parse(r.responseText))}))}},{key:"_convertOptions",value:function(e){return e.challenge=s.toByteArray(s.base64UrlDecode(e.challenge)),e.user.id=s.toByteArray(s.base64Decode(e.user.id)),e}},{key:"_convertAuthenticatorData",value:function(e){return{id:e.id,type:e.type,rawId:s.arrayToBase64String(new Uint8Array(e.rawId)),response:{clientDataJSON:s.arrayToBase64String(new Uint8Array(e.response.clientDataJSON)),attestationObject:s.arrayToBase64String(new Uint8Array(e.response.attestationObject))}}}}])&&y(n.prototype,r),i&&y(n,i),t}(r.a);h=w,g="options",v={initUrl:window.router["frontend.account.webauthn.credential.creation-options"],saveUrl:window.router["frontend.account.webauthn.credential.save"],modalUrl:window.router["frontend.account.webauthn.credential.creation-modal"]},g in h?Object.defineProperty(h,g,{value:v,enumerable:!0,configurable:!0,writable:!0}):h[g]=v;var _=n("2Y4b");function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function S(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function k(e,t){return!t||"object"!==m(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function P(e,t){return(P=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function A(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var U=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),k(this,j(t).apply(this,arguments))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&P(e,t)}(t,e),n=t,(r=[{key:"init",value:function(){if(this._getForm(),!this._form)throw new Error("No form found for plugin: ".concat(this.constructor.name));this._client=new o.a(window.accessKey,window.contextToken),this._registerEvents()}},{key:"_getForm",value:function(){this.el&&"FORM"===this.el.nodeName?this._form=this.el:this._form=this.el.closest("form")}},{key:"_registerEvents",value:function(){this._form.addEventListener("submit",this._onLoginSubmit.bind(this))}},{key:"_onLoginSubmit",value:function(e){var t=_.a.serializeJson(this._form);t.useWebAuthn&&(e.preventDefault(),u.a.create(),console.log("Requesting login options from server"),this._sendRequest(this.options.loginOptionsUrl,{username:t.username},this._getCredential.bind(this)))}},{key:"_getCredential",value:function(e){var t=this._convertLoginOptions(e);console.log("Requesting credentials from authenticator",t),navigator.credentials.get({publicKey:t}).then(this._sendLoginRequest.bind(this),(function(e){u.a.remove(),console.log(e.toString())}))}},{key:"_sendLoginRequest",value:function(e){var t=this._convertAuthenticatorData(e);console.log("Sending login request to server",t),this._sendRequest(this.options.loginValidateUrl,t,this._onLoginSuccess.bind(this))}},{key:"_onLoginSuccess",value:function(e){var t=_.a.serializeJson(this._form);t.redirectPath&&(window.location=t.redirectPath),u.a.remove(),console.log("handleLoginResponse",e)}},{key:"_sendRequest",value:function(e,t,n){var r=this._client.post(e,JSON.stringify(t),(function(){}));r.addEventListener("loadend",(function(){200===r.status&&n(JSON.parse(r.responseText))}))}},{key:"_convertLoginOptions",value:function(e){return e.challenge=s.toByteArray(s.base64UrlDecode(e.challenge)),e.allowCredentials&&(e.allowCredentials=e.allowCredentials.map((function(e){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?O(n,!0).forEach((function(t){A(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):O(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e,{id:s.toByteArray(s.base64UrlDecode(e.id))})}))),e}},{key:"_convertAuthenticatorData",value:function(e){return{id:e.id,type:e.type,rawId:s.arrayToBase64String(new Uint8Array(e.rawId)),response:{authenticatorData:s.arrayToBase64String(new Uint8Array(e.response.authenticatorData)),clientDataJSON:s.arrayToBase64String(new Uint8Array(e.response.clientDataJSON)),signature:s.arrayToBase64String(new Uint8Array(e.response.signature)),userHandle:e.response.userHandle?s.arrayToBase64String(new Uint8Array(e.response.userHandle)):null}}}}])&&S(n.prototype,r),i&&S(n,i),t}(r.a);A(U,"options",{loginOptionsUrl:window.router["frontend.account.webauthn.login.init"],loginValidateUrl:window.router["frontend.account.webauthn.login.finalize"]});var D=window.PluginManager;D.register("CreateCredentialPlugin",w,"[data-create-credential]"),D.register("LoginPlugin",U,".login-form")}},[["YOW1","runtime","vendor-node","vendor-shared"]]]);