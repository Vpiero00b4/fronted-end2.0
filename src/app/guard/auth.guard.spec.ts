import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let executeGuard: CanActivateFn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    executeGuard = TestBed.inject(AuthGuard).canActivate.bind(TestBed.inject(AuthGuard));
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
