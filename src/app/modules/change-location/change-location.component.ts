import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { MyValidator } from 'src/app/validators/my-validator';
import { LocationSetting, LocationPath } from './services/location/location-setting.model';
import { LocationService } from './services/location/location.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertType } from 'src/app/components/alert-window/alert.model';

@Component({
  selector: 'app-change-location',
  templateUrl: './change-location.component.html',
  styleUrls: ['./change-location.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeLocationComponent implements OnInit, OnDestroy {
  /** Stores the form validation behaviour. */
  private _locationForm!: FormGroup;
  private _locationService$!: Subscription;
  /**
   * The represent the saving process state.
   * * Saving finish: false
   * * Saving during: true
  */
  private _isSavingDone = false;

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

  /** Sets the location paths by the location service which come from the server. */
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

  /**
   * It is an event function.
   * It is triggered by the enter keyword.
   * 
   * Saving the task or application app path. Depends on which one is modified.
   * @event onEnter
   */
  @HostListener('window:keydown.enter', ['$event'])
  public onEnterSaving(): void {
    if (!this._isSavingDone) {
      
      // task path
      if (this.taskDataControl.dirty && this.taskDataControl.valid) {
        this._isSavingDone = true;
        // update value to be checked
        this.taskDataControl.updateValueAndValidity();
        this.saveLocationPath(LocationPath.TaskPath, this.taskDataControl);
      }

      // application path
      if (this.appSettingControl.dirty && this.appSettingControl.valid) {
        this._isSavingDone = true;
        // update value to be checked
        this.appSettingControl.updateValueAndValidity();
        this.saveLocationPath(LocationPath.AppSettingPath, this.appSettingControl);
      }
    }
  }

  /**
   * This is an key-up event function.
   * It runs when the typing is occured.
   * 
   * Runs it by the every button is pressed.
   * Saving the typed folder path if it is valid.
   *  
   * @event keyup
   * @param keyLocation It is string, value can be LocationPath(AppSettingPath, TaskPath)
   * @param formControlRef the reference of the given formControl.
   */
  public onChangePath(keyLocation: string, formControlRef: FormControl): void {
    if (formControlRef.valid) {
      // const locKey = LocationPath[keyLocation as keyof typeof LocationPath];
      let locKey = -1;
      if (keyLocation === 'TaskPath') {
        locKey = LocationPath.TaskPath;
      }
      if (keyLocation === 'AppSettingPath') {
        locKey = LocationPath.AppSettingPath;
      }
      
      if (locKey > -1) {
        
        this.saveLocationPath(locKey, formControlRef);
      }
    }
  }

  /**
   * Sending the adjusted location path to the server.
   * @param keyLocation It is enum type, value can be LocationPath(AppSettingPath, TaskPath)
   */
  private saveLocationPath(keyLocation: LocationPath, formControlRef: FormControl): void {
    const waitSeconds = 2000;
    
    this.locationService.saveLocation(keyLocation, formControlRef.value)
    .pipe(
      debounceTime(waitSeconds))
    .subscribe(() => {
      // saving was success
      this.alertMessageService.sendMessage('Path was saved!', AlertType.Success);
    }, () => {
      // saving was unccess
      this.alertMessageService.sendMessage('Path saving was failed!', AlertType.Error);
    }, () => {
      // finally branch
      this._isSavingDone = false;
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
