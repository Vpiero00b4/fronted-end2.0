import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantUsuarioRegisterComponent } from './mant-usuario-register.component';

describe('MantUsuarioRegisterComponent', () => {
  let component: MantUsuarioRegisterComponent;
  let fixture: ComponentFixture<MantUsuarioRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantUsuarioRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantUsuarioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
