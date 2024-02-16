import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantPersonaRegisterComponent } from './mant-persona-register.component';

describe('MantPersonaRegisterComponent', () => {
  let component: MantPersonaRegisterComponent;
  let fixture: ComponentFixture<MantPersonaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantPersonaRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantPersonaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
