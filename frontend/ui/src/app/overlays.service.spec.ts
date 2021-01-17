import { TestBed } from '@angular/core/testing';

import {OverlayModule, Overlay} from '@angular/cdk/overlay'

import { OverlaysService } from './overlays.service';

describe('OverlaysService', () => {
  let service: OverlaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule]
    });
    service = TestBed.inject(OverlaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
