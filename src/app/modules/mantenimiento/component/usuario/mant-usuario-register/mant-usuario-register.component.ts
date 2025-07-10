import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constans/general.constans';
import { UsuarioResponse } from '../../../../../models/usuario-login.response';
import { UsuarioService } from '../../../service/usuario.service';
import { UsuarioRequest } from '../../../../../models/usuario-login.request';


@Component({
  selector: 'app-mant-usuario-register',
  templateUrl: './mant-usuario-register.component.html',
  styleUrl: './mant-usuario-register.component.css'
})
export class MantUsuarioRegisterComponent implements OnInit{
    //DECLARANDO VARIABLES DE ENTRADA 
  @Input () title:string=""; 
  @Input () usuario:UsuarioResponse= new UsuarioResponse; 
  @Input () accion:number=0;
    //DECLARANDO VARIABLES DE ENTRADA 
  @Output() closeModalEmmit=new EventEmitter<boolean>();


    //DECLARANDO VARIABLES INTERNAS
    myForm:FormGroup;
    usuarioEnvio: UsuarioRequest=new UsuarioRequest();
    //DECLARANDO CONSTRUCTOR 
    constructor (
      private fb : FormBuilder,
      private _usuarioService:UsuarioService
    )
      {
        //nuestro formulario usuario request
        this.myForm=this.fb.group({
          idUsuario:[{value:0, disabled:true},[Validators.required]],
          username: ['',[Validators.required]],
          password: ['',[Validators.required]],
          cargo: ['',[Validators.required]],
          estado: [true],
          idPersona: [null,[Validators.required]],
        })
      }
  ngOnInit(): void {
    
    console.log("title==>",this.title)
    console.log("title==>",this.usuario)

    this.myForm.patchValue(this.usuario);
  } 
   guardar(){
    this.usuarioEnvio=this.myForm.getRawValue()
    

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
    this._usuarioService.create(this.usuarioEnvio).subscribe({
      next:(data:UsuarioResponse)=>{
      alert("creado de forma  coorerctae");
      },
      
      error:(err)=>{
      debugger;
      console.error('Error en create:', err);
      alert("Ocurrio un error en crear");
      },
      complete:()=>{
        this.cerrarModal(true);
      }
      
    })
   }

   editarRegistro(){
    this._usuarioService.update(this.usuarioEnvio).subscribe({
      next:(data:UsuarioResponse)=>{

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
 