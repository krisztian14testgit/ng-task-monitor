import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLocationComponent } from './change-location.component';
import { LocationService } from './services/location/location.service';
import { MockLocationService } from 'src/app/tests/mock-services/mock-location.service';
import { LocationPath } from './services/location/location-setting.model';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';


describe('ChangeLocationComponent', () => {
  let component: ChangeLocationComponent;
  let fixture: ComponentFixture<ChangeLocationComponent>;
  let locService: LocationService;
  let mockLocService: MockLocationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ ChangeLocationComponent ],
      providers: [
        {provide: LocationService, useClass: MockLocationService},
        {provide: AlertMessageService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLocationComponent);
    component = fixture.componentInstance;
    locService = TestBed.inject(LocationService);
    mockLocService = new MockLocationService();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the default location path in the form', () => {
    component.ngOnInit();
    // appSetting input field controler
    expect(component.appSettingControl).toBeDefined();
    expect(component.appSettingControl.value).toBe(mockLocService.defaultPath);
    expect(component.appSettingControl.valid).toBeTrue();

    // taskDataControl input field controler
    expect(component.taskDataControl).toBeDefined();
    expect(component.taskDataControl.value).toBe(mockLocService.defaultPath);
    expect(component.taskDataControl.valid).toBeTrue();
  });

  it('should check formControl value when it is Invalid', () => {
    // appSetting input field controler
    let wrongValue = 'C:/folder/../';
    component.appSettingControl.setValue(wrongValue);
    component.appSettingControl.updateValueAndValidity();

    expect(component.appSettingControl).toBeDefined();
    expect(component.appSettingControl.value).toBe(wrongValue);
    expect(component.appSettingControl.valid).toBeFalse();

    // taskDataControl input field controler
    wrongValue = 'c:/folder/adf';  
    component.taskDataControl.setValue(wrongValue);
    component.taskDataControl.updateValueAndValidity();

    expect(component.taskDataControl).toBeDefined();
    expect(component.taskDataControl.value).toBe(wrongValue);
    expect(component.taskDataControl.valid).toBeFalse();
  });

  it('should check formControl value when it is Valid', () => {
    // appSetting input field controler
    let goodValue = 'C:/';
    component.appSettingControl.setValue(goodValue);
    component.appSettingControl.updateValueAndValidity();

    expect(component.appSettingControl).toBeDefined();
    expect(component.appSettingControl.value).toBe(goodValue);
    expect(component.appSettingControl.valid).toBeTrue();

    // taskDataControl input field controler
    goodValue = 'C:/folder/';
    component.taskDataControl.setValue(goodValue);
    component.taskDataControl.updateValueAndValidity();

    expect(component.taskDataControl).toBeDefined();
    expect(component.taskDataControl.value).toBe(goodValue);
    expect(component.taskDataControl.valid).toBeTrue();
  });

  it('should change input value, saving the value of AppSettingPath', () => {
    spyOn(locService, 'saveLocation').and.callThrough();

    const expectedPathValue: string = component.appSettingControl.value;

    // control.Pristine will be false by markAsDirty
    component.appSettingControl.markAsDirty();
    // calling onChangePath event
    component.saveChangedPaths();
    expect(locService.saveLocation).toHaveBeenCalledWith(LocationPath.AppSettingPath, expectedPathValue);
  });

  it('should change input value, saving the value of TaskPath', () => {
    spyOn(locService, 'saveLocation').and.callThrough();

    const expectedPathValue: string = component.taskDataControl.value;

    // control.Pristine will be false by markAsDirty
    component.taskDataControl.markAsDirty();
    // calling onChangePath event
    component.saveChangedPaths();
    expect(locService.saveLocation).toHaveBeenCalledWith(LocationPath.TaskPath, expectedPathValue);
  });
});
