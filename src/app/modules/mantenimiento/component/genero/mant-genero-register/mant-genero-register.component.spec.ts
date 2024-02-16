import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantGeneroRegisterComponent } from './mant-genero-register.component';

describe('MantGeneroRegisterComponent', () => {
  let component: MantGeneroRegisterComponent;
  let fixture: ComponentFixture<MantGeneroRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantGeneroRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantGeneroRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
