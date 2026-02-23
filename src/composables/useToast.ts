import { useUIStore } from "@/stores/ui";

export function useToast() {
  const ui = useUIStore();

  return {
    success: (message: string, duration?: number) =>
      ui.pushToast(message, "success", duration),
    error: (message: string, duration?: number) =>
      ui.pushToast(message, "error", duration),
    warning: (message: string, duration?: number) =>
      ui.pushToast(message, "warning", duration),
    info: (message: string, duration?: number) =>
      ui.pushToast(message, "info", duration),
    dismiss: (id: string) => ui.removeToast(id),
  };
}
