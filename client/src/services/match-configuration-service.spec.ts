import { TestBed } from '@angular/core/testing';

import { MatchConfigurationService } from './match-configuration.service';

describe('MatchConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchConfigurationService = TestBed.get(MatchConfigurationService);
    expect(service).toBeTruthy();
  });
});
