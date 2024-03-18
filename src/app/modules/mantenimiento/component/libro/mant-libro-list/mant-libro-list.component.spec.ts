import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantLibroListComponent } from './mant-libro-list.component';

describe('MantLibroListComponent', () => {
  let component: MantLibroListComponent;
  let fixture: ComponentFixture<MantLibroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantLibroListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantLibroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
