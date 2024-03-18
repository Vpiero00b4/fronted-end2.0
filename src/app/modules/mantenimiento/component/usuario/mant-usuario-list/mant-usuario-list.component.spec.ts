import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantUsuarioListComponent } from './mant-usuario-list.component';

describe('MantUsuarioListComponent', () => {
  let component: MantUsuarioListComponent;
  let fixture: ComponentFixture<MantUsuarioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantUsuarioListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantUsuarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
