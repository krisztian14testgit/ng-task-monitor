import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatRadioChange } from '@angular/material/radio';
import { StyleThemes } from 'src/app/services/models/app-style.model';

import { StyleManagerService } from 'src/app/services/style-manager/style-manager.service';
import { MockStyleManagerService } from 'src/app/tests/mock-services/mock-style-manager.service';

import { StyleThemeComponent } from './style-theme.component';

describe('StyleThemeComponent', () => {
  let component: StyleThemeComponent;
  let fixture: ComponentFixture<StyleThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StyleThemeComponent ],
      providers: [
        { provide: StyleManagerService, useClass: MockStyleManagerService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['defaultTheme']).toBe('Light');
    expect(component['selectedTheme']).toBe('Light');
  });

  it('should store theme into the localStorage', () => {
    // when the localStorage is empty.
    expect(component['selectedTheme']).toBe(component['defaultTheme']);

    // stores the theme
    let expectedTheme = 'Dark';
    component['changeTheme'](expectedTheme);
    let storedTheme = component['getStoredThemeFromLocalStorage']();
    expect(storedTheme).toBe(expectedTheme);

    // wrong theme wont be stored
    const prevTheme = expectedTheme;
    expectedTheme = 'fail';
    component['changeTheme'](expectedTheme);
    // returns the previous theme
    storedTheme = component['getStoredThemeFromLocalStorage']();
    expect(storedTheme).not.toBe(expectedTheme);
    expect(storedTheme).toBe(prevTheme);

    // when the localStorage is empty again, return the default theme
    localStorage.clear();
    expectedTheme = 'fail';
    component['changeTheme'](expectedTheme);
    storedTheme = component['getStoredThemeFromLocalStorage']();
    expect(storedTheme).toBe(component['defaultTheme']);
  });

  it('should render the 3 radio button themes', () => {
    const radioButtonItems = fixture.debugElement.nativeElement.querySelectorAll('mat-radio-button');
    const themeKeys = Object.keys(StyleThemes);
    expect(radioButtonItems.length).toBe(themeKeys.length);

    // checking the value of the each raido buttons, we have all.
    for (let i = 0; i < radioButtonItems.length; i++) {
      expect(radioButtonItems[i].value).toBe(themeKeys[i]);
    }
  });

  it('should clicked on the radio button to change theme', fakeAsync(() => {
    spyOn(component as any, 'changeTheme').and.stub();

    const radioButtonItems = fixture.debugElement.nativeElement.querySelectorAll('mat-radio-button');
    expect(radioButtonItems.length).toBeGreaterThan(0);

    // Dark theme is selected
    const darkThemeIndex = 1;
    const radioDarkItem = radioButtonItems[darkThemeIndex];
    component.onChangeTheme(new MatRadioChange(
      radioDarkItem as any, (radioDarkItem as any).value));
    fixture.detectChanges();

    expect(component.selectedTheme).toBe('Dark');
    expect(component['changeTheme']).toHaveBeenCalledWith(component.selectedTheme);

    // Default: Light theme is selected
    const lightThemeIndex = 0;
    const radioLightItem = radioButtonItems[lightThemeIndex];
    component.onChangeTheme(new MatRadioChange(
      radioLightItem as any, (radioLightItem as any).value));
    fixture.detectChanges();

    expect(component.selectedTheme).toBe('Light');
    expect(component['changeTheme']).toHaveBeenCalledWith(component.selectedTheme);
  }));
});
