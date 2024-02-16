import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mant-persona-list',
  templateUrl: './mant-persona-list.component.html',
  styleUrl: './mant-persona-list.component.css'
})
export class MantPersonaListComponent implements OnInit{
  //FIXME:ES EL PRIMER EVENTO Q EJECUTA EL COMPONENTE
  //
  constructor(
    private _route:Router
  ){}
  ngOnInit(): void {
    let token =sessionStorage.getItem("token");

    if(!token)// token!=prob
    {
      alert("POR FAVOR INICIE SESION");
      this._route.navigate(['auth'])
    }
  }

}
