import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantFventaListComponent } from './mant-fventa-list.component';

describe('MantFventaListComponent', () => {
  let component: MantFventaListComponent;
  let fixture: ComponentFixture<MantFventaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantFventaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantFventaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
