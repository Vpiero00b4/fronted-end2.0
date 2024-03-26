import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constans/general.constans';
import { UsuarioResponse } from '../../../../../models/usuario-login.response';
import { VentaResponse } from '../../../../../models/ventas-response.models';
import { VentaRequest } from '../../../../../models/ventas-request.models';
import { VentasService } from '../../../service/venta.service';


@Component({
  selector: 'app-mant-venta-register',
  templateUrl: './mant-venta-register.component.html',
  styleUrls: ['./mant-venta-register.component.css']
})
export class MantVentaRegisterComponent implements OnInit{
    //DECLARANDO VARIABLES DE ENTRADA 
  @Input () title:string=""; 
  @Input () venta:VentaResponse= new VentaResponse; 
  @Input () usuario:UsuarioResponse= new UsuarioResponse; 
  @Input () accion:number=0;
    //DECLARANDO VARIABLES DE ENTRADA 
  @Output() closeModalEmmit=new EventEmitter<boolean>();


    //DECLARANDO VARIABLES INTERNAS
    myForm:FormGroup;
    ventaEnvio: VentaRequest=new VentaRequest();
    //DECLARANDO CONSTRUCTOR 
    constructor (
      private fb : FormBuilder,
      private _ventaService:VentasService
    )
      {
        //dasboard/mantenimiento/clientes
        //nuestro formulario venta request
        this.myForm=this.fb.group({
          idVenta:[{value:0, disabled:true},[Validators.required]],
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
    console.log("title==>",this.venta)

    this.myForm.patchValue(this.venta);
  } 
   guardar(){
    this.ventaEnvio=this.myForm.getRawValue()
    

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
    this._ventaService.create(this.ventaEnvio).subscribe({
      next:(data:VentaResponse)=>{
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
    this._ventaService.update(this.ventaEnvio).subscribe({
      next:(data:VentaResponse)=>{

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
 