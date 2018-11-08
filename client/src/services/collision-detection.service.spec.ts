import { TestBed } from '@angular/core/testing';

import { CollisionDetectionService } from './collision-detection.service';

describe('CollisionDetectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollisionDetectionService = TestBed.get(CollisionDetectionService);
    expect(service).toBeTruthy();
  });
});
