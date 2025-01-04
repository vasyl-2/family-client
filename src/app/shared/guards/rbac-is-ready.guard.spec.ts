import { TestBed } from '@angular/core/testing';

import { RbacIsReadyGuard } from './rbac-is-ready.guard';

describe('RbacIsReadyGuard', () => {
  let guard: RbacIsReadyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RbacIsReadyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
