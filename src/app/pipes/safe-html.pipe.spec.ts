import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SanitizeService } from '../services/sanitize.service';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizeService: SanitizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        SafeHtmlPipe,
        SanitizeService
      ]
    });
    sanitizeService = TestBed.inject(SanitizeService);
    pipe = new SafeHtmlPipe(sanitizeService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform HTML string to sanitized string', () => {
    const htmlInput = '<p>Test content</p>';
    const result = pipe.transform(htmlInput);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
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
