import { TestBed, inject} from '@angular/core/testing';

import { StyleManagerService } from './style-manager.service';
import { StyleThemes } from '../models/app-style.model';

describe('StyleManagerService', () => {
  let service: StyleManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StyleManagerService]
    });
    service = TestBed.inject(StyleManagerService);
    // default mat class
    document.body.classList.add('mat-typography');
  });

  it('should be created', inject([StyleManagerService], (service: StyleManagerService) => {
    expect(service).toBeTruthy();
  }));

  it('should check the given theme Key is valid', () => {
    // wrong values: null, undefined, '', 'other'
    let wrongValue: null | undefined | string = null;
    expect(service.isValidTheme(wrongValue as any)).toBeFalse();

    wrongValue = undefined;
    expect(service.isValidTheme(wrongValue as any)).toBeFalse();

    wrongValue = '';
    expect(service.isValidTheme(wrongValue)).toBeFalse();

    wrongValue = 'something';
    expect(service.isValidTheme(wrongValue)).toBeFalse();

    // good values: StyleThemes Keys
    const themeKeys = Object.keys(StyleThemes);
    for (const key of themeKeys) {
      expect(service.isValidTheme(key)).toBeTrue();
    }
  });

  it('should NOT work isValidTheme checking on the values of StyleThemes', () => {
    const themeValues = Object.values(StyleThemes);
    for (const value of themeValues) {
      expect(service.isValidTheme(value)).toBeFalse();
    }
  });

  it('should get theme form the body classList', () => {
    let themeValue = service['getThemeFromBodyTag']();
    let expectedValue = '';
    expect(themeValue).toBe(expectedValue);
    expect(document.body.classList.length).toBe(1);

    service['insertTheme'](StyleThemes.BlueDragon);
    themeValue = service['getThemeFromBodyTag']();
    expectedValue = StyleThemes.BlueDragon;
    expect(themeValue).toBe(expectedValue);
    expect(document.body.classList.length).toBe(2);

    service['insertTheme'](StyleThemes.Dark);
    themeValue = service['getThemeFromBodyTag']();
    expectedValue = StyleThemes.Dark;
    expect(themeValue).toBe(expectedValue);
    expect(document.body.classList.length).toBe(3);
    document.body.classList.remove('mat-typography', StyleThemes.Dark, StyleThemes.BlueDragon);
  });

  it('should get empty value if the body classList is empty', () => {
    document.body.classList.remove('mat-typography', StyleThemes.Dark, StyleThemes.BlueDragon);
    const themeValue = service['getThemeFromBodyTag']();
    const expectedValue = '';
    expect(themeValue).toBe(expectedValue);
  });

  it('should turn on the selected theme and the previous one is removed', () => {
    // Default classList length=1, as one class definition is included.
    expect(document.body.classList.length).toBe(1);

    // add wrong values, not added into the classList of the body tag.
    let wrongValue: null | string = null;
    service.turnOnTheme(wrongValue as any);
    expect(document.body.classList.length).toBe(1);

    wrongValue = '';
    service.turnOnTheme(wrongValue as any);
    expect(document.body.classList.length).toBe(1);

    wrongValue = 'wrong';
    service.turnOnTheme(wrongValue as any);
    expect(document.body.classList.length).toBe(1);

    // add good value from StyleThemes
    let theme = StyleThemes.Dark;
    service.turnOnTheme(theme);
    expect(document.body.classList.length).toBe(2);

    theme = StyleThemes.BlueDragon;
    service.turnOnTheme(theme);
    expect(document.body.classList.length).toBe(2);

    // Light theme wont be added into classList, it is default, its value is empty.
    theme = StyleThemes.Light;
    service.turnOnTheme(theme);
    expect(document.body.classList.length).toBe(1);
  });
});
