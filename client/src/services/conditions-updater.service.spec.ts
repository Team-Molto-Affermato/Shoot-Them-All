import { TestBed } from '@angular/core/testing';

import { ConditionUpdaterService } from './condition-updater.service';

describe('ConditionUpdaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConditionUpdaterService = TestBed.get(ConditionUpdaterService);
    expect(service).toBeTruthy();
  });
});
