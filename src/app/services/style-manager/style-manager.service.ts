import { Injectable } from '@angular/core';

enum StyleThemes {
  /** Default theme of the app. */
  Light = '',
  Dark = 'dark-theme',
  BlueDragon = 'blue-dragon'
}

@Injectable()
export class StyleManagerService {
  private classTheme: string;

  constructor() {
    this.classTheme = this.getThemeFromBodyTag();
  }

  //#region Properties
  public get isDefaultTheme(): boolean {
    return this.classTheme === StyleThemes.Light;
  }
  public get isDarkTheme(): boolean {
    return this.classTheme === StyleThemes.Dark;
  }

  public get isBlueDragonTheme(): boolean {
    return this.classTheme === StyleThemes.BlueDragon;
  }
  //#endregion

  public turnOnTheme(theme: StyleThemes): void {
    const prevTheme = this.getThemeFromBodyTag();
    if (this.removeTheme(prevTheme)) {
      this.insertTheme(theme);
    }
  }

  private getThemeFromBodyTag(): StyleThemes {
    if (document.body) {
      const lastIndex = document.body.classList.length;
      const classTheme = document.body.classList[lastIndex];
      return classTheme as StyleThemes;
    }

    return StyleThemes.Light;
  }

  private removeTheme(theme: StyleThemes): boolean {
    if (document.body) {
      if (document.body.classList.contains(theme)) {
        document.body.classList.remove(theme);
        return true;
      }
    }

    return false;
  }

  private insertTheme(theme: StyleThemes): void {
    if (document.body) {
      document.body.classList.add(theme);
    }
  }
}
