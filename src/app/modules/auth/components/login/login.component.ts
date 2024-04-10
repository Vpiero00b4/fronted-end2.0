import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../servicef/auth.service';
import { LoginRequest } from '../../models/login-request.models';
import { LoginResponse } from '../../../../models/login-response.models';
import { Router } from '@angular/router';
import { alert_successlogin } from '../../../../../functions/general.functions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  token: string = "";
  usuarios: LoginRequest[] = [];
  loginForm: FormGroup;
  loginRequest: LoginRequest = new LoginRequest();

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }


  login() {
    console.log(this.loginForm.getRawValue());
    // Este login request lo tengo que enviar hacia el servicio web
    this.loginRequest = this.loginForm.getRawValue();

    this._authService.login(this.loginRequest).subscribe({
      next: (data: LoginResponse) => {
        console.log("ResultadoLogins", data);
        this._router.navigate(['dashboard']);

        // Nosotros almacenamos el valor del token y algunos valores de nuestro
        if (data.success) {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("username", data.usuario.email);
          sessionStorage.setItem("fullName", data.usuario.password);
          sessionStorage.setItem("cargoId", data.usuario.cargo);
          alert_successlogin("LOGIN CORRECTO");
          //redigir al dashboard
          this._router.navigate(['dashboard']);
        } else {
          return;
        }
      },
      error: (err) => {
        console.error("Error durante la solicitud de inicio de sesión:", err);
      },
      complete: () => {
        console.log("Token almacenado en sessionStorage:", sessionStorage.getItem("token"));
      }
    });
  }


}
