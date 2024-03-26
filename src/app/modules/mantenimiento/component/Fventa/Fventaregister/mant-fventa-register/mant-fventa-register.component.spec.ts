import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantFventaRegisterComponent } from './mant-fventa-register.component';

describe('MantFventaRegisterComponent', () => {
  let component: MantFventaRegisterComponent;
  let fixture: ComponentFixture<MantFventaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantFventaRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantFventaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
