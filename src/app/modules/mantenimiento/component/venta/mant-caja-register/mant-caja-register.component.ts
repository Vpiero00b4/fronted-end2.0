import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CajaService } from '../../../service/caja.service';

@Component({
  selector: 'app-mant-caja-register',
  templateUrl: './mant-caja-register.component.html',
  styleUrls: ['./mant-caja-register.component.css']
})
export class MantCajaRegisterComponent  {
  // Inicialización directa con un FormGroup vacío
  updateForm: FormGroup = this.fb.group({
    idCaja: [null],
    saldoInicial: ['', [Validators.required, Validators.min(0)]],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private cajaService: CajaService) {
    this.updateForm = this.fb.group({
      saldoInicial: ['', [Validators.required, Validators.min(0)]],
      saldoFinal: ['', [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required],
      retiroDeCaja: ['', Validators.min(0)],
      ingresosACaja: ['', Validators.min(0)]
    });
  }
  

  crearCaja() {
    if (this.updateForm.valid) {
      this.cajaService.createCaja(this.updateForm.value).subscribe({
        next: (res) => {
          alert('Caja creada con éxito!');
          console.log(res);
        },
        error: (err) => alert('Error al crear la caja: ' + err.message)
      });
    }
  }

  actualizarCaja() {
    if (this.updateForm.valid) {
      this.cajaService.updateCaja(this.updateForm.value).subscribe({
        next: (res) => {
          alert('Caja actualizada con éxito!');
          console.log(res);
        },
        error: (err) => alert('Error al actualizar la caja: ' + err.message)
      });
    }
  }
}
