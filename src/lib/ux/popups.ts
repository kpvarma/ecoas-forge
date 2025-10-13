// Minimal popup/toast abstraction so pages can call a consistent API.
// This file intentionally does not import a concrete toast library — keep it a thin wrapper
export type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number;
};

export const showToast = (message: string, opts?: ToastOptions) => {
  // In-app the project uses Sonner / Toaster — consumer pages can import and wire.
  // For now we fallback to console and window.alert in dev.
  if (typeof window !== "undefined" && (window as any).toast) {
    (window as any).toast(message, opts);
    return;
  }

  if (typeof window !== "undefined") {
    try {
      // Keep non-blocking console fallback
      console.info("Toast:", message, opts);
    } catch (e) {
      // noop
    }
  }
};
