/**
 * Tipos globales para integraciones entre Android (WebView + JSInterface)
 * y la aplicación React.
 *
 * Este archivo es cargado automáticamente por TypeScript.
 * NO debe importarse manualmente en los componentes.
 */

export {};

declare global {
  interface Window {
    /**
     * Bridge que expone métodos de Android hacia la WebApp dentro del WebView.
     * Todos estos métodos provienen de la clase JSInterface.java
     */
    AndroidInterface?: {
      /**
       * Convierte un JSON de inventario a PDF.
       * Implementado en Android.
       */
      jsonToPdf: (inventoryJson: string) => void;

      /**
       * Envía un JSON al servidor interno de Android para almacenamiento.
       */
      sendJsonToServer?: (jsonString: string) => void;

      /**
       * Abre el selector nativo de archivos Android.
       */
      openFileSelector?: () => void;

      /**
       * Obtiene el Android ID real del dispositivo.
       */
      getAndroidId?: () => string;

      /**
       * Indica si la clave pública RSA ya está creada en el Keystore.
       * Usado para mostrar el loader premium.
       */
      isPublicKeyReady?: () => boolean;

      /**
       * Obtiene la clave pública RSA en Base64.
       */
      getPublicKeyBase64?: () => string;

      /**
       * Android descifra una licencia enviada desde el WebView.
       * Luego ejecuta window.licenseDecryptionResult(...)
       */
      decryptLicenseFromWebView?: (payloadJsonBase64: string) => string;
      findLicenseInWhatsApp?: () => void;
      onLicenseFound?: (licenseData: string) => void;
      onLicenseSearchError?: (error: string) => void;
      onDecryptionResult?: (decryptedLicense: string) => void;
      shareToWhatsApp?: (text: string) => void;
      shareZipWithAppChooser: () => void;
      openLicenseFilePicker?: () => void;
      onLicenseVerified?: (verifiedLicense: string) => void;
      // Métodos de compartición (NUEVOS - opcionales)
      //shareSecurePackage?: () => void;
      //canShareSecurePackage?: () => boolean;
      shareZipFile?: () => void; // ✅ Mantenemos solo este método
    };

    /**
     * Callback desde Android → WebView para pasar datos JSON procesados.
     * Usado en tu app de inventario.
     */
    useJsonData?: (jsonString: string) => void;

    /**
     * Callback global ejecutado cuando Android termina de descifrar la licencia.
     * Se utiliza exclusivamente por el verificador premium.
     */
    licenseDecryptionResult?: (decryptedPayload: string) => void;
  }
}

/* // ----------------- Declaración de Interface Global -----------------
declare global {
  interface Window {
    AndroidInterface: {
      getAndroidId: () => string;
      getPublicKeyBase64: () => string;
      isPublicKeyReady: () => boolean;
      findLicenseInWhatsApp: () => void;
      decryptLicenseFromWebView: (encryptedData: string) => void;
      onLicenseFound: (licenseData: string) => void;
      onLicenseSearchError: (error: string) => void;
      onDecryptionResult: (decryptedLicense: string) => void;
    };
  }
}
 */
