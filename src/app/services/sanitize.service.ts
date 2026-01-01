import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

/**
 * Service for sanitizing HTML content to prevent XSS attacks.
 * Uses Angular's DomSanitizer to safely handle HTML content.
 */
@Injectable({
  providedIn: 'root'
})
export class SanitizeService {

  constructor(private readonly sanitizer: DomSanitizer) { }

  /**
   * Sanitizes HTML content to prevent XSS attacks.
   * Uses Angular's DomSanitizer with SecurityContext.HTML to safely clean the content.
   * 
   * @param html The HTML string to sanitize
   * @returns Sanitized HTML string that can be used with [innerHTML]
   * 
   * @example
   * const safeHtml = sanitizeService.sanitize('<p>Hello World</p>');
   */
  public sanitize(html: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
}
