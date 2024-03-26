import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MantVentaRegisterComponent } from './mant-venta-register.component';

describe('MantVentaRegisterComponent', () => {
  let component: MantVentaRegisterComponent;
  let fixture: ComponentFixture<MantVentaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantVentaRegisterComponent],
      imports: [FormsModule, ReactiveFormsModule] // Asegúrate de importar los módulos necesarios
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantVentaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Aquí puedes escribir más pruebas unitarias para probar el comportamiento del componente
});
