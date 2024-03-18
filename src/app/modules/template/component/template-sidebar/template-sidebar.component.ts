import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-sidebar',
  templateUrl: './template-sidebar.component.html',
  styleUrls: ['./template-sidebar.component.css']
})
export class TemplateSidebarComponent implements OnInit{
    menu: any[] = [];

    ngOnInit(): void {
      this.rellenarMenu();
  }

  rellenarMenu() {
    let cargoId = sessionStorage.getItem("cargoId");
    switch (cargoId) 
    {
      //CUANDO ES ADMIN
      case "1":
        this.menu = [
          {
            name: "Mantenimiento", target:"TargetMantenimiento", icon:"fas fa-trash",
            subMenu: [
              // {name: "Genero",url: "mantenimiento/genero",icon: "fas fa-card"},
              {name: "Persona",url: "mantenimiento/persona",icon: "fas fa-user"},
              {name: "origen",url: "mantenimiento/origen",icon: "fas fa-dashboard"},
              {name: "usuario",url: "mantenimiento/usuario",icon: "fas fa-users"}, 
              {name: "tipo documento",url: "mantenimiento/tipo-documento",icon: "fas fa-file"}, 
            ]
          },
          {
            name: "Ventas", target:"TargetVentas", icon:"fas fa-edit",
            subMenu: [
              {name: "atn1",url: "mantenimiento/genero",icon: "fas fa-card"},
              {name: "atn2",url: "mantenimiento/persona",icon: "fas fa-user"},
              {name: "atn3",url: "mantenimiento/origen",icon: "fas fa-dashboard"},
              {name: "atn4",url: "mantenimiento/usuario",icon: "fas fa-users"}, 
              {name: "atn5",url: "mantenimiento/tipo-documento",icon: "fas fa-file"}, 
            ]
          },
        ];
        break;
      case "2" : break;
      case "3" : break;
      case "4" : break;
      case "5" : break;
      case "6" : break;
    }
  }
}
