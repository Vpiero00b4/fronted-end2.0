import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantCajaListComponent } from './mant-caja-list.component';

describe('MantCajaListComponent', () => {
  let component: MantCajaListComponent;
  let fixture: ComponentFixture<MantCajaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantCajaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantCajaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
