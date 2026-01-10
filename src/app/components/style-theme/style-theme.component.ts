import { Component, signal } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { StyleThemes } from 'src/app/services/models/app-style.model';
import { CommonModule } from '@angular/common';

import { StyleManagerService } from '../../services/style-manager/style-manager.service';

/**
 * Changes the style themes of the app with the radio button items.
 */
@Component({
    selector: 'app-style-theme',
    templateUrl: './style-theme.component.html',
    styleUrls: ['./style-theme.component.css'],
    standalone: true,
    imports: [CommonModule, MatRadioModule]
})
export class StyleThemeComponent {
  /** Contains the key names of the StyleThemes enum. */
  public styleThemes: string[];
  /** Stores the selected theme's key name. */
  public selectedTheme = signal('Light');
  private readonly STORAGE_KEY = 'savedTheme';
  /** Default theme is StyleThemes.Light, stored name: 'Light'. */
  private readonly _defaultTheme: string;

  constructor(private readonly styleManagerService: StyleManagerService) {
    this.styleThemes = Object.keys(StyleThemes);
    this._defaultTheme = this.styleThemes[0];
    const storedTheme = this.getStoredThemeFromLocalStorage();
    this.selectedTheme.set(storedTheme);
    
    if (storedTheme) {
      this.changeTheme(storedTheme);
    }
  }

  /**
   * This is a change event functon.
   * 
   * It triggers when radio button item is selected.
   * Changes the style theme of the App.
   * @event change
   * @param event MatRadio event.
   */
  public onChangeTheme($event: MatRadioChange): void {
    const theme = $event.value;
    this.selectedTheme.set(theme);
    if (theme) {
      this.changeTheme(theme);
    }
  }

  /**
   * Returns the stored style theme of the App which was applied.
   * @returns StyleThemes value.
   */
  private getStoredThemeFromLocalStorage(): string {
    const theme = localStorage.getItem(this.STORAGE_KEY);
    return theme ? theme : this._defaultTheme;
  }

  /**
   * Changes the style theme of the app with style manger service and
   * stores the selected theme into the local storage.
   * @param themeKey The key of the StyleThemes.
   */
  private changeTheme(themeKey: string): void {
    if (this.styleManagerService.isValidTheme(themeKey)) {
      // convert string to enum: StyleThemes['enumString']
      const themeValue = StyleThemes[themeKey as keyof typeof StyleThemes];
      this.styleManagerService.turnOnTheme(themeValue);
      // saves it localStorage
      localStorage.setItem(this.STORAGE_KEY, themeKey);
    }
  }
}
