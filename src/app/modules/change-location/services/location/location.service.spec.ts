import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { LocationPath, LocationSetting } from './location-setting.model';

/**
 * Help writing http test
 * https://braydoncoyer.dev/blog/how-to-unit-test-an-http-service-in-angular
 */
describe('LocationService', () => {
  let service: LocationService;
  let mockHttp: HttpTestingController;
  const locationUrl = 'http://localhost:8080/location';
  const fakedPath = 'C:/Users/../Documents/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });

    service = TestBed.inject(LocationService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([LocationService], (instanceObj: LocationService ) => {
    expect(instanceObj).toBeTruthy();
  }));

  xit('should get location setting', fakeAsync(() => {
    service.getLocationSetting()
    .subscribe((locSetting: LocationSetting) => {
      expect(locSetting).toBeDefined();
      expect(locSetting.appSettingPath).toBe(fakedPath);
      expect(locSetting.taskPath).toBe(fakedPath);
    });

    const req = mockHttp.expectOne({url: locationUrl, method: 'GET'});
    expect(req.request.method).toBe('GET');

    // sent dummy data
    const dummyData = new LocationSetting();
    dummyData.appSettingPath = fakedPath;
    dummyData.taskPath = fakedPath;
    req.flush(dummyData);
  }));

  xit('should save location setting', fakeAsync(() => {
    service.saveLocation(LocationPath.AppSettingPath, fakedPath)
    .subscribe(isTrue => expect(isTrue).toBeTrue());

    const req = mockHttp.expectOne({url: locationUrl, method: 'POST'});
    expect(req.request.method).toBe('POST');

    // sent dummy data
    req.flush(true); // saving was success
  }));

  xit('should save location setting is failed, 503', fakeAsync(() => {
    service.saveLocation(LocationPath.AppSettingPath, fakedPath)
    .subscribe(() => {return ;}, (err) =>  {
      expect(err.status).toBe(503);
      expect(err.statusText).toBe('Bad request');
    });

    const req = mockHttp.expectOne({url: locationUrl, method: 'POST'});
    // expect(req).toBe('POST');

    // sent dummy data
    req.flush(false, {status: 503, statusText: 'Bad request'});
  }));
});
