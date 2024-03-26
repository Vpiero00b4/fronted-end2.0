import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneroResponse } from '../../../models/genero-response.models';
import { GeneroRequest } from '../../../models/genero-request.models';
import { UrlConstants } from '../../../constans/url.constans';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
  export class GeneroService extends CrudService<GeneroRequest,GeneroResponse> {

    constructor(
      protected http: HttpClient,
      ) { 
        super(http,UrlConstants.genero);
        
      }
   
  }
  