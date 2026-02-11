import { TestBed } from '@angular/core/testing';

import { SoapserviceService } from './soapservice.service';

describe('SoapserviceService', () => {
  let service: SoapserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoapserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

