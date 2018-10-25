import { TestBed } from '@angular/core/testing';

import { MatchConverterService } from './match-converter.service';

describe('MatchConverterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchConverterService = TestBed.get(MatchConverterService);
    expect(service).toBeTruthy();
  });
});
