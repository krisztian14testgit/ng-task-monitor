import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { StyleThemes } from 'src/app/services/models/app-style.model';

import { StyleManagerService } from '../../services/style-manager/style-manager.service';

/**
 * Changes the style themes of the app with the radio button items.
 */
@Component({
  selector: 'app-style-theme',
  templateUrl: './style-theme.component.html',
  styleUrls: ['./style-theme.component.css']
})
export class StyleThemeComponent {
  /** Contains the key names of the StyleThemes enum. */
  public styleThemes: string[];
  /** Stores the selected theme's key name. */
  public selectedTheme: string;
  private readonly STORAGE_KEY = 'savedTheme';
  /** Default theme is StyleThemes.Light, stored name: 'Light'. */
  private readonly defaultTheme: string;

  constructor(private readonly styleManagerService: StyleManagerService) {
    this.styleThemes = Object.keys(StyleThemes);
    this.defaultTheme = this.styleThemes[0];
    this.selectedTheme = this.getStoredThemeFromLocalStorage();
    
    if (this.selectedTheme) {
      this.changeTheme(this.selectedTheme);
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
    this.selectedTheme = $event.value;
    if (this.selectedTheme) {
      this.changeTheme(this.selectedTheme);
    }
  }

  /**
   * Returns the stored style theme of the App which was applied.
   * @returns StyleThemes value.
   */
  private getStoredThemeFromLocalStorage(): string {
    const theme = localStorage.getItem(this.STORAGE_KEY);
    return theme ? theme : this.defaultTheme;
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
