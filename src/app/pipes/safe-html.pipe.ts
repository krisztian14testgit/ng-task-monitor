import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
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
   * Transforms HTML string into SafeHtml.
   * 
   * @param value The HTML string to sanitize
   * @returns SafeHtml object that can be safely rendered with [innerHTML]
   */
  transform(value: string): SafeHtml {
    return this.sanitizeService.sanitizeHtml(value);
  }

}
