import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';
  import { HttpClient } from '@angular/common/http';
  import { switchMap } from 'rxjs/operators';
  import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostVentaService {}
//Ayudame con la logica en este servicio, si no es necesario no hagamos nada 