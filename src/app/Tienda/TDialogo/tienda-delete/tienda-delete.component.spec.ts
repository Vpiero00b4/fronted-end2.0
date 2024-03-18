import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaDeleteComponent } from './tienda-delete.component';

describe('TiendaDeleteComponent', () => {
  let component: TiendaDeleteComponent;
  let fixture: ComponentFixture<TiendaDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiendaDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiendaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
