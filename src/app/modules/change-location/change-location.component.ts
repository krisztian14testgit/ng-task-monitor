import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { FormValidator } from 'src/app/validators/my-validator';
import { LocationSetting, LocationPath } from './services/location/location-setting.model';
import { LocationService } from './services/location/location.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertType } from 'src/app/components/alert-window/alert.model';

@Component({
    selector: 'app-change-location',
    templateUrl: './change-location.component.html',
    styleUrls: ['./change-location.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, MatCardModule, MatInputModule]
})
export class ChangeLocationComponent {
  /** Stores the error message for the input is invalid. */
  public inputInvalidText = '';
  /** Stores the form validation behaviour. */
  private _locationForm!: FormGroup;
  /**
   * The represent the saving process state.
   * * Saving finish: false
   * * Saving during: true
  */
  private _isSavingDone = false;

  private readonly locationService = inject(LocationService);
  private readonly alertMessageService = inject(AlertMessageService);
  private readonly destroyRef = inject(DestroyRef);

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

  constructor() {
    this.createLocationFormValidation();
    this.inputInvalidText = 'Please enter a valid path! E.g.: C:/folder/...';
    this.getlocationPathFromService();
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
        this.taskDataControl.updateValueAndValidity();
        this.saveLocationPath(LocationPath.TaskPath, this.taskDataControl);
      }

      // application path
      if (this.appSettingControl.dirty && this.appSettingControl.valid) {
        this._isSavingDone = true;
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
      const locKey: number = LocationPath[keyLocation as keyof typeof LocationPath];
      
      if (locKey !== undefined && locKey > -1) {
        this.saveLocationPath(locKey, formControlRef);
      }
    }
  }

  /**
   * Sending the adjusted location path to the server.
   * @param keyLocation It is enum type, value can be LocationPath(AppSettingPath, TaskPath)
   */
  private saveLocationPath(keyLocation: LocationPath, formControlRef: FormControl): void {
    this.locationService.saveLocation(keyLocation, formControlRef.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertMessageService.sendMessage('Path is saved!', AlertType.Success);
          this._isSavingDone = false;
        },
        error: () => {
          this.alertMessageService.sendMessage('Path saving is failed!', AlertType.Error);
          this._isSavingDone = false;
        }
      });
  }

  /** Sets the location paths by the location service which come from the server. */
  private getlocationPathFromService(): void {
    this.locationService.getLocationSetting()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((locSetting: LocationSetting) => {
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
