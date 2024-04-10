import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroModalComponentComponent } from './libro-modal-component.component';

describe('LibroModalComponentComponent', () => {
  let component: LibroModalComponentComponent;
  let fixture: ComponentFixture<LibroModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibroModalComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibroModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
