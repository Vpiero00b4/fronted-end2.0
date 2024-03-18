import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let token = sessionStorage.getItem("token");

    if (!token) {
      alert("GUARD: No se ha iniciado sesión");

      // Redirige a localhost:4200/auth
      //CONFIRAR PARA ENEVIAR A LA PAGINA ANTERIOR
      this.router.navigate(['/auth']);

      return false;
    }

    return true;
  }
}
