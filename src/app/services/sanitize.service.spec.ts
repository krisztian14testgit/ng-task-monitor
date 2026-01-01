import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { SanitizeService } from './sanitize.service';

describe('SanitizeService', () => {
  let service: SanitizeService;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SanitizeService]
    });
    service = TestBed.inject(SanitizeService);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sanitize HTML content', () => {
    const htmlInput = '<p>Test content</p>';
    const result = service.sanitize(htmlInput);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should handle empty string', () => {
    const result = service.sanitize('');
    expect(result).toBe('');
  });

  it('should sanitize potentially dangerous content', () => {
    const dangerousHtml = '<script>alert("xss")</script><p>Safe content</p>';
    const result = service.sanitize(dangerousHtml);
    // The sanitizer should remove the script tag
    expect(result).toBeTruthy();
    expect(result).not.toContain('<script>');
  });
});
