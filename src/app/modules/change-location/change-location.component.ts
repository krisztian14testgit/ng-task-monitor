import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { MyValidator } from 'src/app/validators/my-validator';
import { LocationSetting, LocationPath } from './services/location/location-setting.model';
import { LocationService } from './services/location/location.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertType } from 'src/app/components/alert-window/alert.model';

@Component({
  selector: 'app-change-location',
  templateUrl: './change-location.component.html',
  styleUrls: ['./change-location.component.css']
})
export class ChangeLocationComponent implements OnInit, OnDestroy {
  /** Stores the form validation behaviour. */
  private _locationForm!: FormGroup;
  private _locationService$!: Subscription;

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

  constructor(private readonly locationService: LocationService,
              private readonly alertMessageService: AlertMessageService) {
    this.createLocationFormValidation();
  }

  /** Set the location paths by the location service which come from server. */
  ngOnInit(): void {
    this._locationService$ = this.locationService.getLocationSetting()
    .subscribe((locSetting: LocationSetting) => {
      this.appSettingControl.setValue(locSetting.appSettingPath);
      this.taskDataControl.setValue(locSetting.taskPath);
    });
  }

  /** Unsubscription from the API streams */
  ngOnDestroy(): void {
    this._locationService$.unsubscribe();
  }

  @HostListener('window:keydown.enter', ['$event'])
  public onEnterSaving(): void {
    if (this.taskDataControl.dirty) {
      // update value to be checked
      this.taskDataControl.updateValueAndValidity();
      this.saveLocationPath('TaskPath', this.taskDataControl);
    }

    if (this.appSettingControl.dirty) {
      // update value to be checked
      this.appSettingControl.updateValueAndValidity();
      this.saveLocationPath('AppSettingPath', this.appSettingControl);
    }
  }

  /**
   * This is an key-up event function.
   * It runs when the typing is occured.
   * Saving the typed folder path if it is valid.
   *  
   * @event keyup
   * @param keyLocation It is string, value can be LocationPath(AppSettingPath, TaskPath)
   * @param formControlRef the reference of the given formControl.
   */
  public onChangePath(keyLocation: string, formControlRef: FormControl): void {
    if (formControlRef.valid) {
      this.saveLocationPath(keyLocation, formControlRef);
    }
    // enter hostListener handling --> saving
  }

  /**
   * Sending the adjusted locaiton path to the server.
   * @param keyLocation It is string, value can be LocationPath(AppSettingPath, TaskPath)
   */
  private saveLocationPath(keyLocation: string, formControlRef: FormControl): void {
    const waitSeconds = 2000;
    // converting string to enum value
    const locKey = LocationPath[keyLocation as keyof typeof LocationPath];
    this.locationService.saveLocation(locKey, formControlRef.value)
    .pipe(debounceTime(waitSeconds))
    .subscribe(() => {
      // saving was success
      this.alertMessageService.sendMessage('Path was saved!', AlertType.Success);
    });
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
