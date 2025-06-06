import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CajaService } from '../../../service/caja.service';

@Component({
  selector: 'app-mant-caja-register',
  templateUrl: './mant-caja-register.component.html',
  styleUrls: ['./mant-caja-register.component.css']
})
export class MantCajaRegisterComponent implements OnInit {
  updateForm: FormGroup;
  listaCajas: any[] = [];

  constructor(private fb: FormBuilder, private cajaService: CajaService) {
    this.updateForm = this.fb.group({
      idCaja: [0],
      saldoInicial: [null, [Validators.required, Validators.min(0)]],
      saldoFinal: [0],
      fecha: [this.getFechaActual(), Validators.required],
      ingresosACaja: [0],
      fechaCierre: [null],
      saldoDigital: [0]
    });
  }

  ngOnInit(): void {
    this.cargarCajas();
  }

  cargarCajas() {
    this.cajaService.getCajas().subscribe({
      next: (res) => this.listaCajas = res,
      error: (err) => alert('Error al cargar las cajas: ' + err.message)
    });
  }

  crearCaja() {
    if (this.updateForm.valid) {
      const payload = this.updateForm.value;

      this.cajaService.createCaja(payload).subscribe({
        next: () => {
          alert('Caja creada con éxito!');
          this.cargarCajas();
          this.updateForm.reset({
            idCaja: 0,
            saldoInicial: null,
            saldoFinal: 0,
            fecha: this.getFechaActual(),
            ingresosACaja: 0,
            fechaCierre: null,
            saldoDigital: 0
          });
        },
        error: (err) => alert('Error al crear la caja: ' + err.message)
      });
    }
  }

  private getFechaActual(): string {
    const ahora = new Date();
    return ahora.toISOString().slice(0, 16); // compatible con datetime-local
  }
}
