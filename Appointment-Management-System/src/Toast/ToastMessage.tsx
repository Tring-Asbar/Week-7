import { toast,ToastOptions } from 'react-toastify'

type toastProps={
    message:string,
    toastType: ToastOptions['type'];
   
}

const ToastMessage = ( { message, toastType }: toastProps) => {
        toast(message,{
            type: toastType,
            autoClose :3000,
            closeOnClick:true,
        })
    
  return (
    <>
    
    </>
  )
}

export default ToastMessage