import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantGeneroListComponent } from './mant-genero-list.component';

describe('MantGeneroListComponent', () => {
  let component: MantGeneroListComponent;
  let fixture: ComponentFixture<MantGeneroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantGeneroListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantGeneroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
