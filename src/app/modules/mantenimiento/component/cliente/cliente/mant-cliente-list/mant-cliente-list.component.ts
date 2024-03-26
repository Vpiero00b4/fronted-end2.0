import { Component, OnInit } from '@angular/core';
import { ClienteResponse } from '../../../../../../models/clientes-response.models';
import { ClienteService } from '../../../../service/cliente.service';
import { PersonaResponse } from '../../../../../../models/persona-response-models';

@Component({
  selector: 'app-mant-cliente-register',
  templateUrl: './mant-cliente-list.component.html',
  styleUrls: ['./mant-cliente-list.component.css']
})
export class MantClienteListComponent implements OnInit {
  clientesConPersona: (ClienteResponse & PersonaResponse)[] = [];

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.obtenerClientesConPersona();
  }

  obtenerClientesConPersona(): void {
    this.clienteService.obtenerClienteConPersona().subscribe(
      clientes => {
        this.clientesConPersona = clientes;
      },
      error => {
        console.error('Error al obtener clientes:', error);
      }
    );
  }
}
