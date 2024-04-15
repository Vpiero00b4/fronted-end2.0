import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantCajaRegisterComponent } from './mant-caja-register.component';

describe('MantCajaRegisterComponent', () => {
  let component: MantCajaRegisterComponent;
  let fixture: ComponentFixture<MantCajaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantCajaRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantCajaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
