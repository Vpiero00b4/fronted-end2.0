import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.models';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../../models/login-response.models';
import { UrlConstants } from '../../../constans/url.constans';
import { UsuarioResponse } from '../../../models/usuario-login.response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Persona: any;
  Libro: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(UrlConstants.auth, request).pipe(
      tap((response: { success: any; token: string; usuario: any; }) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
        }
      })
    );
  }

  // auth.service.ts
  getUsuario(): any {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  getCargo(): string | null {
    const usuario = this.getUsuario();
    return usuario?.cargo ?? null;
  }

  logout(): void {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento
    localStorage.removeItem('user');  // Opcional: Elimina la info del usuario
    sessionStorage.clear();           // Limpia todo el sessionStorage
    this.router.navigate(['/auth']);
  }

}
