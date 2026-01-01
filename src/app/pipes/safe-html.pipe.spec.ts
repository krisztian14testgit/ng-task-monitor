import { TestBed } from '@angular/core/testing';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SanitizeService } from '../services/sanitize.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizeService: SanitizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SafeHtmlPipe,
        SanitizeService,
        DomSanitizer
      ]
    });
    sanitizeService = TestBed.inject(SanitizeService);
    pipe = new SafeHtmlPipe(sanitizeService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform HTML string to SafeHtml', () => {
    const htmlInput = '<p>Test content</p>';
    const result = pipe.transform(htmlInput);
    expect(result).toBeTruthy();
  });

  it('should handle empty string', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should sanitize HTML content through the pipe', () => {
    const htmlInput = '<div><strong>Bold</strong> text</div>';
    const result = pipe.transform(htmlInput);
    expect(result).toBeTruthy();
  });

  it('should remove dangerous scripts', () => {
    const dangerousHtml = '<script>alert("xss")</script><p>Safe</p>';
    const result = pipe.transform(dangerousHtml);
    expect(result).toBeTruthy();
    expect(result).not.toContain('<script>');
  });
});
