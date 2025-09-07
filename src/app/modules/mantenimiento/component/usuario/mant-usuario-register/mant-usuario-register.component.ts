import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constans/general.constans';
import { UsuarioResponse } from '../../../../../models/usuario-login.response';
import { UsuarioService } from '../../../service/usuario.service';
import { UsuarioRequest } from '../../../../../models/usuario-login.request';
import { PersonaResponse } from '../../../../../models/persona-response-models';
import { PersonaService } from '../../../service/persona.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mant-usuario-register',
  templateUrl: './mant-usuario-register.component.html',
  styleUrl: './mant-usuario-register.component.css'
})
export class MantUsuarioRegisterComponent implements OnInit {
  @Input() title: string = "";
  @Input() usuario: UsuarioResponse = new UsuarioResponse();
  @Input() accion: number = 0;
  @Output() closeModalEmmit = new EventEmitter<boolean>();
  
  myForm: FormGroup;
  usuarioEnvio: UsuarioRequest = new UsuarioRequest();
  buscarRealizado: boolean = false;
  // Variables de búsqueda de persona
  personasEncontradas: PersonaResponse[] = [];
  nombrePersona: string = '';
  mostrarModalPersona = false;

  // Variables de password
  mostrarPassword = false;
  textoEncriptadoOriginal: string | null = null;
  passwordDesencriptada: string | null = null;


  esEdicion = false;

  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private personaService: PersonaService,
    private http: HttpClient
  ) {
    this.myForm = this.fb.group({
      idUsuario: [{ value: 0, disabled: true }],
      username: ['', Validators.required],
      password: ['', Validators.required],
      cargo: ['', Validators.required],
      estado: [true],
      idPersona: [null, Validators.required],
      nombrePersona: [this.usuario?.nombre || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.esEdicion = !!this.usuario?.idUsuario;
    if (this.usuario) this.myForm.patchValue(this.usuario);

    if (this.usuario.idPersona) {
      this.obtenerPersonaPorId(this.usuario.idPersona);
    }
  }
  obtenerPersonaPorId(idPersona: number) {
    this.personaService.obtenerPersonaPorId(idPersona).subscribe({
      next: (persona) => {
        this.myForm.patchValue({
          nombrePersona: `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`
        });
      },
      error: () => {
        this.nombrePersona = "No encontrada";
      }
    });
  }
  // Buscar personas usando FormGroup
  buscarPersona() {
    const nombre = this.myForm.get('nombrePersona')?.value?.trim();

    if (!nombre) {
      Swal.fire('Aviso', 'Ingrese un nombre para buscar', 'warning');
      return;
    }

    this.personaService.buscarPorNombre(nombre).subscribe({
      next: (data) => {
        this.personasEncontradas = data;
        this.buscarRealizado = true;
      },
      error: () => {
        this.personasEncontradas = [];
        this.buscarRealizado = true;
        Swal.fire(
          'Error',
          'Persona no encontrada. Creela desde Cliente o corrija el nombre.',
          'error'
        );
      }
    });
  }

  // Seleccionar persona
  seleccionarPersona(persona: PersonaResponse) {
    // Actualiza el nombre en el FormControl
    this.myForm.patchValue({
      nombrePersona: `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`,
      idPersona: persona.idPersona
    });

    // Limpia resultados de búsqueda
    this.personasEncontradas = [];
  }

  limpiarBusqueda() {
    this.personasEncontradas = [];
    this.myForm.patchValue({ nombrePersona: '' });
    this.myForm.patchValue({ idPersona: null });
  }

  abrirModalPersona() { this.mostrarModalPersona = true; }
  cerrarModalPersona() { this.mostrarModalPersona = false; }

  // Guardar usuario según acción
  guardar() {
    if (this.myForm.invalid) {
      Swal.fire('Error', 'Complete todos los campos obligatorios', 'error');
      return;
    }

    this.usuarioEnvio = this.myForm.getRawValue();

    switch (this.accion) {
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

  crearRegistro() {
    this._usuarioService.create(this.usuarioEnvio).subscribe({
      next: (data: UsuarioResponse) => {
        Swal.fire('¡Creado!', 'Usuario creado correctamente', 'success');
      },
      error: () => Swal.fire('Error', 'Ocurrió un error al crear', 'error'),
      complete: () => this.cerrarModal(true)
    });
  }

  editarRegistro() {
    this._usuarioService.update(this.usuarioEnvio).subscribe({
      next: () => Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success'),
      error: () => Swal.fire('Error', 'Ocurrió un error al actualizar', 'error'),
      complete: () => this.cerrarModal(true)
    });
  }

  cerrarModal(res: boolean) { this.closeModalEmmit.emit(res); }

  // Password
  togglePasswordVisibility() {
    if (!this.mostrarPassword && this.esEdicion) {
      this.desencriptarPassword();
    } else {
      this.mostrarPassword = !this.mostrarPassword;
    }
  }

  desencriptarPassword() {
    if (!this.usuario.password) return;

    // Guardar la versión encriptada solo la primera vez
    if (!this.textoEncriptadoOriginal) {
      this.textoEncriptadoOriginal = this.usuario.password;
    }

    const body = { EncryptedText: this.textoEncriptadoOriginal };

    this.http.post<{ decryptedText: string }>('https://libsaber-h6befwejedhaakb9.canadacentral-01.azurewebsites.net/api/Cripto/desencriptar', body).subscribe({
      next: (response) => {
        this.passwordDesencriptada = response.decryptedText;
        this.mostrarPassword = true;
      },
      error: (err) => {
        console.error('Error al desencriptar la contraseña:', err);
      }
    });
  }

personaCreada(persona: PersonaResponse) {
  this.myForm.patchValue({
    nombrePersona: `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`,
    idPersona: persona.idPersona
  });
  this.cerrarModalPersona();
}

}
