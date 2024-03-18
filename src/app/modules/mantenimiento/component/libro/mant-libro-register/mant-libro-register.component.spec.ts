import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantLibroRegisterComponent } from './mant-libro-register.component';

describe('MantLibroRegisterComponent', () => {
  let component: MantLibroRegisterComponent;
  let fixture: ComponentFixture<MantLibroRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantLibroRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantLibroRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
