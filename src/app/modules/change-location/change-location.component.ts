import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyValidator } from 'src/app/validators/my-validator';

@Component({
  selector: 'app-change-location',
  templateUrl: './change-location.component.html',
  styleUrls: ['./change-location.component.css']
})
export class ChangeLocationComponent implements OnInit {
  /** Stores the form validation behaviour. */
  public locationForm!: FormGroup;

  //#region Properties
  /** Returns the reference of taskData FormControl. */
  public get taskDataControl(): FormControl {
    return this.locationForm.get('taskDataPath') as FormControl;
  }

  /** Returns the reference of appSetting FormControl. */
  public get appSettingControl(): FormControl {
    return this.locationForm.get('appSettingPath') as FormControl;
  }

  constructor() { }

  /** Initialization the locationFrom instance from the FormGroup. */
  ngOnInit(): void {
    this.locationForm = new FormGroup({
      taskDataPath: new FormControl('', [
        Validators.required, 
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.LibraryPath))
      ]),
      appSettingPath: new FormControl('alma', [
        Validators.required,
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.LibraryPath))
      ])
    });
  }

}
