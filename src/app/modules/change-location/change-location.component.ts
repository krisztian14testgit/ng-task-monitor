import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { MyValidator } from 'src/app/validators/my-validator';
import { LocationPath, LocationService } from './services/location/location-service';
import { LocationSetting } from './services/location/location-setting';

@Component({
  selector: 'app-change-location',
  templateUrl: './change-location.component.html',
  styleUrls: ['./change-location.component.css']
})
export class ChangeLocationComponent implements OnInit {
  /** Stores the form validation behaviour. */
  private _locationForm!: FormGroup;

  //#region Properties
  /** Returns the reference of taskData FormControl. */
  public get taskDataControl(): FormControl {
    return this._locationForm.get('taskDataPath') as FormControl;
  }

  /** Returns the reference of appSetting FormControl. */
  public get appSettingControl(): FormControl {
    return this._locationForm.get('appSettingPath') as FormControl;
  }
  //#endregion

  constructor(private readonly locationService: LocationService) {
    this.createLocationFormValidation();
  }

  /** Set the location paths by the location service which come from server. */
  ngOnInit(): void {
    this.locationService.getLocationSetting()
    .subscribe((locSetting: LocationSetting) => {
      this.appSettingControl.setValue(locSetting.appSettingPath);
      this.taskDataControl.setValue(locSetting.taskPath);
    });
  }

  /**
   * This is an key-up event function.
   * It runs when the typing is occured.
   * Saving the tyoed folder path if it is valid.
   *  
   * @event keyup
   * @param keyLocation is string, value can be LocationPath
   * @param formControlRef the reference of the given formControl.
   */
  public onChangePath(keyLocation: string, formControlRef: FormControl): void {
    const waitSeconds = 2000;
    // converting string to enum value
    if (formControlRef.valid) {
      const locKey = LocationPath[keyLocation as keyof typeof LocationPath];
      this.locationService.saveLocation(locKey, formControlRef.value)
      .pipe(debounceTime(waitSeconds))
      .subscribe();
    }
    
  }

  /** Initialization the locationFrom instance from the FormGroup. */
  private createLocationFormValidation(): void {
    this._locationForm = new FormGroup({
      taskDataPath: new FormControl('', [
        Validators.required, 
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.LibraryPath))
      ]),
      appSettingPath: new FormControl('', [
        Validators.required,
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.LibraryPath))
      ])
    });
  }

}
