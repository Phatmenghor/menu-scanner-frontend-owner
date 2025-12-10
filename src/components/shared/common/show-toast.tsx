// utils/toast.ts
import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, defaultOptions);
  },

  error: (message: string) => {
    toast.error(message, defaultOptions);
  },

  warning: (message: string) => {
    toast.warning(message, defaultOptions);
  },

  info: (message: string) => {
    toast.info(message, defaultOptions);
  },
};
