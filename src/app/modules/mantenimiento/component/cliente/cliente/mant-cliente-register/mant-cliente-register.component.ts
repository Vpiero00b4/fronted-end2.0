import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteResponse } from '../../../../../../models/clientes-response.models';
import { UsuarioResponse } from '../../../../../../models/usuario-login.response';
import { ClienteRequest } from '../../../../../../models/clientes-request.models';
import { ClienteService } from '../../../../service/cliente.service';
import { AccionMantConst } from '../../../../../../constans/general.constans';


@Component({
  selector: 'app-mant-cliente-register',
  templateUrl: './mant-cliente-register.component.html',
  styleUrl: './mant-cliente-register.component.css'
})
export class MantClienteRegisterComponent implements OnInit{
  //DECLARANDO VARIABLES DE ENTRADA 
  @Input () title:string=""; 
  @Input () cliente:ClienteResponse= new ClienteResponse; 
  @Input () usuario:UsuarioResponse= new UsuarioResponse; 
  @Input () accion:number=0;
    //DECLARANDO VARIABLES DE ENTRADA 
  @Output() closeModalEmmit=new EventEmitter<boolean>();


    //DECLARANDO VARIABLES INTERNAS
    myForm:FormGroup;
    clienteEnvio: ClienteRequest=new ClienteRequest();
    //DECLARANDO CONSTRUCTOR 
    constructor (
      private fb : FormBuilder,
      private _clienteService:ClienteService
    )
      {
        //dasboard/mantenimiento/clientes
        //nuestro formulario cliente request
        this.myForm=this.fb.group({
          idCliente:[{value:0, disabled:true},[Validators.required]],
          codigoCliente: [null,[Validators.required]],
          idPersona: [null,[Validators.required]],
        })
        
      }
  ngOnInit(): void {
    
    console.log("title==>",this.title)
    console.log("title==>",this.cliente)

    this.myForm.patchValue(this.cliente);
  } 
   guardar(){
    this.clienteEnvio=this.myForm.getRawValue()
    

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
    this._clienteService.create(this.clienteEnvio).subscribe({
      next:(data:ClienteResponse)=>{
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
    this._clienteService.update(this.clienteEnvio).subscribe({
      next:(data:ClienteResponse)=>{

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
 