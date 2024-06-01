import { TestBed } from '@angular/core/testing';

import { HighlightChapterService } from './highlight-chapter.service';

describe('HighlightChapterService', () => {
  let service: HighlightChapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighlightChapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
