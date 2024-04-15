import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-sidebar',
  templateUrl: './template-sidebar.component.html',
  styleUrls: ['./template-sidebar.component.css']
})
export class TemplateSidebarComponent implements OnInit{
    menu: any[] = [];

    ngOnInit(): void {
  }

  
}
