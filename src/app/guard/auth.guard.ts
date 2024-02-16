import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  //let _router: Router;

  let token = sessionStorage.getItem("token");
  if (!token) {
    alert(" GUARD No se ha iniciado sesión");
    
    // Debemos redirigir al usuario hacia la pantalla de login
    //_router.navigate(['auth']); // Cambié "this._router" a "_router" ya que no es necesario utilizar "this" en este contexto

    return false;
  }

  return true;
};
