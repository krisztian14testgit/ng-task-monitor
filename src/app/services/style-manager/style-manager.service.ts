import { Injectable } from '@angular/core';
import { StyleThemes } from '../models/app-style.model';

/**
 * Handler the attaching and removing the style themes of the App.
 */
@Injectable()
export class StyleManagerService {

  /**
   * Returns true if the given themeKey is belong StyleThemes enum,
   * otherwise returns false in any values.
   * 
   * @param themeKey The key values from the StyleThemes
   * @returns boolean
   */
  public isValidTheme(themeKey: string): boolean {
    const keys = Object.keys(StyleThemes);
    return keys.includes(themeKey);
  }

  /**
   * Activates the given themes, the previous one will be removed from
   * the body classList.
   * @param theme The value of StyleThemes
   */
  public turnOnTheme(theme: StyleThemes): void {
    const prevTheme = this.getThemeFromBodyTag();
    if (prevTheme) {
      this.removeTheme(prevTheme);
    }

    const themeValues = Object.values(StyleThemes);
    if (themeValues.includes(theme)) {
      this.insertTheme(theme);
    }
  }

  /**
   * Returns the last index of the classList of the body.
   * If the classList contains one class defition or it is empty, return -1;
   * 
   * @description
   * There is one typography class is occupied in the classList.
   * @returns index
   */
  private getLastIndexOfBodyClass(): number {
    // occupied value: mat-typography, zero index is occupied
    const lastIndex = document.body.classList.length - 1;
    return  lastIndex > 0 ? lastIndex : -1; 

  }

  /**
   * Returns the last class themes form the classList of the body.
   * @returns themes value
   */
  private getThemeFromBodyTag(): string {
    if (document.body) {
      const lastIndex = this.getLastIndexOfBodyClass();
      if (lastIndex > -1) {
        return document.body.classList[lastIndex];
      }
    }

    // Return default: StyleThemes.Light
    return '';
  }

  /**
   * Removes the given style theme from the classList of the body.
   * 
   * Returns true if the removing is success, otherwise returns false.
   * @param themeValue The value of the StyleThemes.
   * @returns boolean
   */
  private removeTheme(themeValue: string): boolean {
    if (document.body) {
      if (document.body.classList.contains(themeValue)) {
        document.body.classList.remove(themeValue);
        return true;
      }
    }

    return false;
  }

  /**
   * Adds the given style theme into the classList of the body.
   * @param theme The value of the StyleThemes.
   */
  private insertTheme(theme: StyleThemes): void {
    if (theme && document.body) {
      document.body.classList.add(theme);
    }
  }
}
