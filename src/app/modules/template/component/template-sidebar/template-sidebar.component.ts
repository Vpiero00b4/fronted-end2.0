import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-sidebar',
  templateUrl: './template-sidebar.component.html',
  styleUrls: ['./template-sidebar.component.css']
})
export class TemplateSidebarComponent implements OnInit {
  isSidebarExpanded = false;

  ngOnInit(): void {}

 
}
