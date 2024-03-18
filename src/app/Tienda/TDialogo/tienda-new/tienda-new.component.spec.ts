import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaNewComponent } from './tienda-new.component';

describe('TiendaNewComponent', () => {
  let component: TiendaNewComponent;
  let fixture: ComponentFixture<TiendaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiendaNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiendaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
