import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaAddEditComponent } from './tienda-add-edit.component';

describe('TiendaAddEditComponent', () => {
  let component: TiendaAddEditComponent;
  let fixture: ComponentFixture<TiendaAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiendaAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiendaAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
