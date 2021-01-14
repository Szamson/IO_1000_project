import { TestBed } from '@angular/core/testing';

import { LicitationService } from './licitation.service';

describe('LicitationService', () => {
  let service: LicitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
