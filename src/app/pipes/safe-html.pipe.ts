import { Pipe, PipeTransform } from '@angular/core';
import { SanitizeService } from '../services/sanitize.service';

/**
 * Pipe that sanitizes HTML content to prevent XSS attacks.
 * 
 * @example
 * <div [innerHTML]="htmlContent | safeHtml"></div>
 */
@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private readonly sanitizeService: SanitizeService) { }

  /**
   * Transforms HTML string into sanitized HTML.
   * 
   * @param value The HTML string to sanitize
   * @returns Sanitized HTML string that can be safely rendered with [innerHTML]
   */
  transform(value: string): string {
    return this.sanitizeService.sanitize(value);
  }

}
