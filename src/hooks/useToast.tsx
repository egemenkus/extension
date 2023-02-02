import { toast } from "react-toastify";

export const useToast = () => {
  const showErrorToast = (message: string | any) => {
    toast.error(String(message), {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      className: "toast",
    });
  };

  return {
    showErrorToast,
  };
};
