import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { StyleManagerService, StyleThemes } from '../../services/style-manager/style-manager.service';

@Component({
  selector: 'app-style-theme',
  templateUrl: './style-theme.component.html',
  styleUrls: ['./style-theme.component.css']
})
export class StyleThemeComponent {
  public styleThemes: string[];
  public selectedTheme: string;
  private readonly storageKey = 'savedTheme';
  private readonly defaultTheme: string;

  constructor(private readonly styleManagerService: StyleManagerService) {
    this.styleThemes = Object.keys(StyleThemes);
    this.defaultTheme = this.styleThemes[0];
    this.selectedTheme = this.getStoredTheme();
    
    // TODO: default light selection not work at radio button
    if (this.selectedTheme) {
      this.changeTheme(this.selectedTheme);
    }
  }

  public onChangeTheme(event: MatRadioChange): void {
    this.selectedTheme = event.value;
    if (this.selectedTheme && this.styleManagerService.isValidTheme(this.selectedTheme)) {
      this.changeTheme(this.selectedTheme);
      console.log('body class=', document.body.className);
    }
  }

  private getStoredTheme(): string {
    const theme = localStorage.getItem(this.storageKey);
    return theme ? theme : this.defaultTheme;
  }

  private changeTheme(themeKey: string): void {
    // convert string to enum: StyleThemes['enumString']
    const themeValue = StyleThemes[themeKey as keyof typeof StyleThemes];
    this.styleManagerService.turnOnTheme(themeValue);
    // saves it localStorage
    localStorage.setItem(this.storageKey, this.selectedTheme);
  }
}
