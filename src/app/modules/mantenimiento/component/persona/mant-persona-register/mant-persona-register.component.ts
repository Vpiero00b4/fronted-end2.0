import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constans/general.constans';
import { PersonaService } from '../../../service/persona.service';
import { PersonaResponse } from '../../../../../models/persona-response-models';
import { PersonaRequest } from '../../../../../models/persona-request-models';
import { UsuarioResponse } from '../../../../../models/usuario-login.response';


@Component({
  selector: 'app-mant-persona-register',
  templateUrl: './mant-persona-register.component.html',
  styleUrl: './mant-persona-register.component.css'
})
export class MantPersonaRegisterComponent implements OnInit{
    //DECLARANDO VARIABLES DE ENTRADA 
  @Input () title:string=""; 
  @Input () persona:PersonaResponse= new PersonaResponse; 
  @Input () usuario:UsuarioResponse= new UsuarioResponse; 
  @Input () accion:number=0;
    //DECLARANDO VARIABLES DE ENTRADA 
  @Output() closeModalEmmit=new EventEmitter<boolean>();


    //DECLARANDO VARIABLES INTERNAS
    myForm:FormGroup;
    personaEnvio: PersonaRequest=new PersonaRequest();
    //DECLARANDO CONSTRUCTOR 
    constructor (
      private fb : FormBuilder,
      private _personaService:PersonaService
    )
      {
        //dasboard/mantenimiento/clientes
        //nuestro formulario persona request
        this.myForm=this.fb.group({
          idPersona:[{value:0, disabled:true},[Validators.required]],
          nombre: [null,[Validators.required]],
          apellidoPaterno: [null,[Validators.required]],
          apellidoMaterno: [null,[Validators.required]],
          correo: [null,[Validators.required,Validators.email]],
          tipoDocumento: [null,[Validators.required]],
          numeroDocumento: [null,[Validators.required]],
          telefono: [null,[Validators.required]]
        })
        
      }
  ngOnInit(): void {
    
    console.log("title==>",this.title)
    console.log("title==>",this.persona)

    this.myForm.patchValue(this.persona);
  } 
   guardar(){
    this.personaEnvio=this.myForm.getRawValue()
    

    switch(this.accion){
      case AccionMantConst.crear:
        this.crearRegistro();
      break;
      case AccionMantConst.editar:
        this.editarRegistro();

      break;
      case AccionMantConst.eliminar:
        break;
    }
   }
   crearRegistro(){
    this._personaService.create(this.personaEnvio).subscribe({
      next:(data:PersonaResponse)=>{
      alert("creado de forma  coorerctae");
      },
      
      error:()=>{
      debugger;
      alert("Ocurrio un error en crear");
      },
      complete:()=>{
        this.cerrarModal(true);
      }
      
    })

   }
   editarRegistro(){
    this._personaService.update(this.personaEnvio).subscribe({
      next:(data:PersonaResponse)=>{

      alert("Actualizado de forma correct");
      },
      error:()=>{
      debugger;
      alert("Ocurrio un error en editar");
      },
      complete:()=>{
      this.cerrarModal(true);
      }
    })
   }
   cerrarModal(res:boolean)

   {
    this.closeModalEmmit.emit(res);

   }
}
 