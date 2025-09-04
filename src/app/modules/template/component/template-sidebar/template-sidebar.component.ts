import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/servicef/auth.service';

@Component({
  selector: 'app-template-sidebar',
  templateUrl: './template-sidebar.component.html',
  styleUrls: ['./template-sidebar.component.css']
})
export class TemplateSidebarComponent implements OnInit {
  isSidebarExpanded = false;
  cargo: string | null = null;;

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.cargo = this.authService.getCargo();
  }

  esAdmin(): boolean {
    return this.cargo === 'admin';
  }

  esVendedor(): boolean {
    return this.cargo === 'vendedor';
  }

  esInventario(): boolean {
    return this.cargo === 'INVENTARIO';
  }
  logout() {
    this.authService.logout();
  }
  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
