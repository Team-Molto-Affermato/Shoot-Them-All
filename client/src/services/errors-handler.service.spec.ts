import { TestBed } from '@angular/core/testing';

import { ErrorsHandlerService } from './errors-handler.service';

describe('ErrorsHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorsHandlerService = TestBed.get(ErrorsHandlerService);
    expect(service).toBeTruthy();
  });
});
