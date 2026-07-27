import { createElement, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

type ToastOptions = {
  description?: string;
  action?: ReactNode;
};

const baseOptions = {
  duration: 4000,
  closeButton: true,
};

const withIcon = (icon: ReactNode) => ({ ...baseOptions, icon });

const iconProps = { className: "size-4" };

export const adminToast = {
  success(title: string, options?: ToastOptions) {
    return toast.success(title, {
      ...withIcon(createElement(CheckCircle2, { ...iconProps, className: "size-4 text-emerald-600" })),
      description: options?.description,
      action: options?.action,
    });
  },
  error(title: string, options?: ToastOptions) {
    return toast.error(title, {
      ...withIcon(createElement(CircleAlert, { ...iconProps, className: "size-4 text-red-600" })),
      description: options?.description,
      action: options?.action,
    });
  },
  warning(title: string, options?: ToastOptions) {
    return toast.warning(title, {
      ...withIcon(createElement(TriangleAlert, { ...iconProps, className: "size-4 text-amber-600" })),
      description: options?.description,
      action: options?.action,
    });
  },
  info(title: string, options?: ToastOptions) {
    return toast.info(title, {
      ...withIcon(createElement(Info, { ...iconProps, className: "size-4 text-sky-600" })),
      description: options?.description,
      action: options?.action,
    });
  },
};
