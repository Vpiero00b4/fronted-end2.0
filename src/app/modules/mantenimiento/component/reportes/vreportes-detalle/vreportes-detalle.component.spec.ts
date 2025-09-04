import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VReportesDetalleComponent } from './vreportes-detalle.component';

describe('VReportesDetalleComponent', () => {
  let component: VReportesDetalleComponent;
  let fixture: ComponentFixture<VReportesDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VReportesDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VReportesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
