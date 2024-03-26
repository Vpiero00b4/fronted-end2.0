import { timer } from "rxjs";
import Swal from "sweetalert2";

export function convertToBoolean(input : string): boolean{
    try{
        return JSON.parse(input.toLowerCase());
    }
    catch(e){
        return false;
    }
}

export function alert_successlogin(title: string, timer?: number, text?: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      position: 'center',
      showConfirmButton: false,
      timer: timer == null || timer == undefined ? 2000 : timer
    });
  }
export function alert_success(title: string, timer?: number, text?: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      position: 'top-end',
      showConfirmButton: false,
      timer: timer == null || timer == undefined ? 1500 : timer
    });
  }
  export function alert_warning(title: string, timer?: number) {
    Swal.fire({
      icon: 'warning',
      title: title,
      showConfirmButton: false,
      timer: timer == null || timer == undefined ? 3000 : timer
    });
  }
  export function alert_error(title:string,message:string)
  {
  Swal.fire({

      icon: "error",
      title: title,
      text: message,
      showConfirmButton:false
      
    });
  }