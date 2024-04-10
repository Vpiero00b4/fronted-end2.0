import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FventaRegisterComponent } from './mant-fventa-register.component';

describe('MantFventaRegisterComponent', () => {
  let component: FventaRegisterComponent;
  let fixture: ComponentFixture<FventaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FventaRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FventaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
