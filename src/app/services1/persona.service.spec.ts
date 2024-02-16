import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { PersonaService } from './persona.service';

describe('AuthService', () => {
  let service: PersonaService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
