import { toast, ToastOptions } from "react-toastify";

type toastType="info"|"success"|"warning"|"error"
const notificationToast = (text:string,type:toastType) => {
    const toastOptions:ToastOptions={
        autoClose:3000,
        closeOnClick: true,
        closeButton:false,
    }
    switch(type){
        case "info":
            toast.info(text,toastOptions);
            break;
        case "success":
            toast.success(text,toastOptions);
            break;
        case "warning":
            toast.warn(text,toastOptions);
            break;
        case "error":
            toast.error(text,toastOptions);
            break;
        default:
            toast.info(text,toastOptions);
            break;
    }

};

export default notificationToast;