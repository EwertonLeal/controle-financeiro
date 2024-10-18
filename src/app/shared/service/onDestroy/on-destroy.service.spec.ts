import { TestBed } from '@angular/core/testing';

import { OnDestroyService } from './on-destroy.service';

describe('OnDestroyService', () => {
  let service: OnDestroyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnDestroyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
