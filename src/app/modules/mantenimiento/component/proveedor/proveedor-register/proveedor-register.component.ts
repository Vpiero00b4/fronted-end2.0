import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { ProveedorResponse } from '../../../../../models/proveedor-response.models';
import { ProveedorService } from '../../../service/proveedor.service';

@Component({
  selector: 'app-proveedor-register',
  templateUrl: './proveedor-register.component.html',
  styleUrl: './proveedor-register.component.css'
})
export class ProveedorRegisterComponent {
  @Input() accion: number = 1; // 1 = Crear, 2 = Editar
  @Input() proveedor: ProveedorResponse = new ProveedorResponse();
  @Output() closeModalEmmit = new EventEmitter<boolean>();

  myForm: FormGroup;

  constructor(private fb: FormBuilder, private proveedorService: ProveedorService) {
    this.myForm = this.fb.group({
      idProveedor: [{ value: 0, disabled: true }],
      razonSocial: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      direccion: ['', Validators.required],
      idTipoProveedor: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.accion === 2 && this.proveedor) {
      this.myForm.patchValue(this.proveedor);
    }
  }

  guardar(): void {
    if (this.myForm.invalid) {
      Swal.fire('Error', 'Complete todos los campos obligatorios', 'error');
      return;
    }

    const proveedorEnvio = this.myForm.getRawValue() as ProveedorResponse;

    if (this.accion === 1) {
      this.proveedorService.create(proveedorEnvio).subscribe({
        next: () => Swal.fire('¡Creado!', 'Proveedor creado correctamente', 'success'),
        error: () => Swal.fire('Error', 'Ocurrió un error al crear', 'error'),
        complete: () => this.cerrarModal(true)
      });
    } else if (this.accion === 2) {
      this.proveedorService.update(proveedorEnvio).subscribe({
        next: () => Swal.fire('Actualizado', 'Proveedor actualizado correctamente', 'success'),
        error: () => Swal.fire('Error', 'Ocurrió un error al actualizar', 'error'),
        complete: () => this.cerrarModal(true)
      });
    }
  }

  cerrarModal(res: boolean): void {
    this.closeModalEmmit.emit(res);
  }
}
