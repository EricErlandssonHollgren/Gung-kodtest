import { TestBed } from '@angular/core/testing';

import { DataTraverserService } from './data-traverser.service';

describe('DataTraverserService', () => {
  let service: DataTraverserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTraverserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
