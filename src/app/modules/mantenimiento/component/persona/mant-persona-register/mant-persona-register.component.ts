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
  styleUrls: ['./mant-persona-register.component.css']
})
export class MantPersonaRegisterComponent implements OnInit {
  @Input() title: string = "";
  @Input() persona: PersonaResponse = new PersonaResponse();
  @Input() usuario: UsuarioResponse = new UsuarioResponse();
  @Input() accion: number = 0;
  @Output() closeModalEmmit = new EventEmitter<boolean>();
  @Output() personaCreada = new EventEmitter<PersonaResponse>();

  myForm: FormGroup;
  personaEnvio: PersonaRequest = new PersonaRequest();

  constructor(
    private fb: FormBuilder,
    private _personaService: PersonaService
  ) {
    this.myForm = this.fb.group({
      idPersona: [{ value: 0, disabled: true }, [Validators.required]],
      tipoDocumento: [null, [Validators.required]],
      numeroDocumento: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      apellidoPaterno: [null, [Validators.required]],
      apellidoMaterno: [null, [Validators.required]],
      correo: [null, [Validators.email]],
      telefono: [null,
      [

        Validators.pattern(/^[0-9]*$/),
        Validators.maxLength(9)
      ]
    ]    });
  }
  soloNumeros(event: KeyboardEvent): void {
  const charCode = event.charCode;
  if (charCode !== 0 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
}


  ngOnInit(): void {
    if (this.accion === AccionMantConst.editar && this.persona) {
      this.myForm.patchValue(this.persona);
    }
  }

  buscarPorDocumento(): void {
    const tipoDoc = this.myForm.get('tipoDocumento')?.value;
    const numeroDoc = this.myForm.get('numeroDocumento')?.value;

    if (!tipoDoc || !numeroDoc) {
      alert("Debe ingresar tipo y número de documento.");
      return;
    }

    this._personaService.obtenerPersonaPorDocumento(tipoDoc, numeroDoc).subscribe({
      next: (data: PersonaResponse) => {
        if (!data || !data.nombre) {
          alert("No se encontraron datos para el documento ingresado.");
          return;
        }

        // Cargar valores en el formulario
        this.myForm.patchValue({
          idPersona: data.idPersona,
          nombre: data.nombre,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno,
          correo: data.correo,
          telefono: data.telefono
        });
      },
      error: (err) => {
        console.error(err);
        alert("Error al buscar persona. Verifique el documento.");
      }
    });
  }

  guardar(): void {
    this.personaEnvio = this.myForm.getRawValue();

    switch (this.accion) {
      case AccionMantConst.crear:
        this.crearRegistro();
        break;
      case AccionMantConst.editar:
        this.editarRegistro();
        break;
    }
  }

  crearRegistro(): void {
    this._personaService.create(this.personaEnvio).subscribe({
      next: () => alert("Registro creado correctamente."),
      error: () => {
        alert("Error al crear el registro.");
      },
      complete: () => this.cerrarModal(true)
    });
  }

  editarRegistro(): void {
    this._personaService.update(this.personaEnvio).subscribe({
      next: () => alert("Registro actualizado correctamente."),
      error: () => {
        alert("Error al actualizar el registro.");
      },
      complete: () => this.cerrarModal(true)
    });
  }

  cerrarModal(res: boolean): void {
    this.closeModalEmmit.emit(res);
  }
}
