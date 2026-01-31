import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { FormValidator } from 'src/app/validators/my-validator';
import { LocationSetting, LocationPath } from './services/location/location-setting.model';
import { LocationService } from './services/location/location.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertType } from 'src/app/components/alert-window/alert.model';

type IndexStructure = { [property: string]:string };
@Component({
    selector: 'app-change-location',
    templateUrl: './change-location.component.html',
    styleUrls: ['./change-location.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule]
})
export class ChangeLocationComponent implements OnInit, OnDestroy {
  /** Stores the error message for the input is invalid. */
  public inputInvalidText = '';
  /** Stores the form validation behaviour. */
  private _locationForm!: FormGroup;
  /** The subcription of the location service. */
  private _locationService$!: Subscription;
  /**
   * The represent the saving process state.
   * * Saving finish: false
   * * Saving during: true
  */
  private _isSavingDone = false;
  /** Preserve the pervious paths of the AppSettingPAth and TaskPath. */
  private _previousLocationSetting!: LocationSetting;

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
    this.inputInvalidText = 'Please enter a valid path! E.g.: C:/folder/sub-forlders/...';
  }

  /** Sets saved tasks and appSetting paths. */
  ngOnInit(): void {
    this.getlocationPathFromService();
  }

  /** Unsubscription from the API streams */
  ngOnDestroy(): void {
    this._locationService$.unsubscribe();
  }

  /**
   * It is keydown.enter event function.
   * It is triggered by the enter keyword.
   * 
   * Saving the task and application app path. Depends on which one is modified.
   * @event onEnter
   */
  @HostListener('window:keydown.enter')
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
   * This is an onClick event function.
   * It runs when the 'Save changes' button is clicked on.
   * 
   * Saving the folder paths of appSettingPath or taskPath if they are valid.
   *  
   * @event click
   */
  public saveChangedPaths(): void {
    if (this.taskDataControl.valid && this.appSettingControl.valid) {
      let locKey = -1;
      // taskPath is changed
      if (!this.taskDataControl.pristine) {
        locKey = LocationPath.TaskPath;
        this.saveLocationPath(locKey, this.taskDataControl);
      }

      // appSetting path is changed
      if (!this.appSettingControl.pristine) {
        locKey = LocationPath.AppSettingPath;
        this.saveLocationPath(locKey, this.appSettingControl);
      }
    } else {
      this.alertMessageService.sendMessage('One of paths is invalid', AlertType.Warning);
    }
  }

  /**
   * Sending the adjusted location paths to the electron through the service.
   * @param keyLocation It is enum type, value can be LocationPath(AppSettingPath, TaskPath)
   */
  private saveLocationPath(keyLocation: LocationPath, formControlRef: FormControl): void {
    
    this.locationService.saveLocation(keyLocation, formControlRef.value)
    .subscribe(() => {
      // saving was success
      this.alertMessageService.sendMessage('Path is saved!', AlertType.Success);
    }, () => {
      // saving was unccess
      this.alertMessageService.sendMessage(`Path saving is failed at ${LocationPath[keyLocation]}! 
        Perhaps, The app doesn't have permission to create folder.`, AlertType.Error);
      // re-adjust the previous path
      const propNames = ['appSettingPath', 'taskPath'];
      const selectedLocProp = propNames[keyLocation];
      formControlRef.setValue((this._previousLocationSetting as unknown as IndexStructure)[selectedLocProp]);
    }, () => {
      // finally branch
      this._isSavingDone = false;
    });
  }

  /** Sets the location paths by the location service which come from the appSetting.json file. */
  private getlocationPathFromService(): void {
    this._locationService$ = this.locationService.getLocationSetting()
    .subscribe((locSetting: LocationSetting) => {
      // deep copy the locSetting fields.
      this._previousLocationSetting = {...locSetting};
      this.appSettingControl.setValue(locSetting.appSettingPath);
      this.taskDataControl.setValue(locSetting.taskPath);
    });
  }

  /** Initialization the locationFrom instance from the FormGroup. */
  private createLocationFormValidation(): void {
    this._locationForm = new FormGroup({
      taskDataPath: new FormControl('', [
        Validators.required, 
        Validators.pattern(FormValidator.RegExpPatterns.getRule(FormValidator.RegExpKeys.LibraryPath))
      ]),
      appSettingPath: new FormControl('', [
        Validators.required,
        Validators.pattern(FormValidator.RegExpPatterns.getRule(FormValidator.RegExpKeys.LibraryPath))
      ])
    });
  }
}
