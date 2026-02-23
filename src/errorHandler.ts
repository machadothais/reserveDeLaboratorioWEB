// src/services/errorHandler.ts

// ✅ Captura erros globais de runtime (como os causados por extensões)
window.onerror = function (
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
): boolean {
  const sourceStr = source || "";

  // 🔹 Ignora erros causados por extensões (ex: Avast SafePrice)
  const isExtensionError =
    sourceStr.includes("chrome-extension://") || sourceStr.includes("moz-extension://");

  if (isExtensionError) {
    console.warn("⚠️ Erro ignorado: extensão do navegador interferindo ->", sourceStr);
    return true; // ✅ impede que o erro quebre a aplicação
  }

  // 🔹 Exibe erros reais do seu código
  console.error("❌ Erro capturado globalmente:", { message, source, lineno, colno, error });
  return false; // permite que o console exiba erros legítimos
};

// ✅ Captura rejeições de Promises não tratadas
window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
  const reason = event.reason;

  if (typeof reason === "object" && reason?.message?.includes("chrome-extension")) {
    console.warn("⚠️ Rejeição ignorada de extensão:", reason);
    event.preventDefault();
  }
});
