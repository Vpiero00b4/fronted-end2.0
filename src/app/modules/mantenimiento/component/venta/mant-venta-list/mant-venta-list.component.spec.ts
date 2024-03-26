import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantVentaListComponent } from './mant-venta-list.component';

describe('MantVentaListComponent', () => {
  let component: MantVentaListComponent;
  let fixture: ComponentFixture<MantVentaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantVentaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantVentaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
