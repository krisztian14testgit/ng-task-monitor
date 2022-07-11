import { Injectable } from '@angular/core';
import { StyleThemes } from 'src/app/services/models/app-style.model';

/**
 * Mock Handler the attaching and removing the style themes of the App.
 * Attaching and removing style themes are faked behaviour.
 */
@Injectable()
export class MockStyleManagerService {

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
     * 
     * That proecess is faked, not removing or inserting theme into the classList.
     * @param theme The value of StyleThemes
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public turnOnTheme(theme: StyleThemes): void {
        return ;
    }
}
