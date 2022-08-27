import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError } from 'rxjs';

import { LocationService } from './location.service';
import { LocationPath, LocationSetting } from './location-setting.model';

/**
 * Help writing http test
 * https://braydoncoyer.dev/blog/how-to-unit-test-an-http-service-in-angular
 */
describe('LocationService', () => {
  let service: LocationService;
  const fakedPath = 'C:/Users/../Documents/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });

    service = TestBed.inject(LocationService);

    // it is used for saving location method
    spyOn(service as any, '_electornSaveLocationPaths').and.stub();
  });

  it('should be created', inject([LocationService], (instanceObj: LocationService ) => {
    expect(instanceObj).toBeTruthy();
  }));

  it('should get location setting', fakeAsync(() => {
    // sent dummy data
    const dummyData = new LocationSetting();
    dummyData.appSettingPath = fakedPath;
    dummyData.taskPath = fakedPath;
    spyOn(service as any, '_electronGetLocationPaths').and.returnValue(Promise.resolve(dummyData));

    service.getLocationSetting()
    .subscribe((locSetting: LocationSetting) => {
      expect(locSetting).toBeDefined();
      expect(locSetting.appSettingPath).toBe(fakedPath);
      expect(locSetting.taskPath).toBe(fakedPath);
    });
  }));

  it('should save location setting', fakeAsync(() => {
    service.saveLocation(LocationPath.AppSettingPath, fakedPath)
    .subscribe(isTrue => expect(isTrue).toBeTrue());
  }));

  it('should save location setting is failed, Electron saving error', fakeAsync(() => {
    spyOn(service, 'saveLocation').and.callFake(() => throwError(new Error('Saving is failed')));
    
    service.saveLocation(LocationPath.AppSettingPath, fakedPath)
    .subscribe(() => {return ;}, (err: Error) =>  {
      expect(err.message).toBe('Saving is failed');
    });
  }));
});
