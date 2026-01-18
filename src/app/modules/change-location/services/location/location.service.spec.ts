import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { LocationPath, LocationSetting } from './location-setting.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
    imports: [],
    providers: [LocationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(LocationService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([LocationService], (instanceObj: LocationService ) => {
    expect(instanceObj).toBeTruthy();
  }));

  it('should get location setting', fakeAsync(() => {
    service.getLocationSetting()
    .subscribe((locSetting: LocationSetting) => {
      expect(locSetting).toBeDefined();
      expect(locSetting.appSettingPath).toBe(fakedPath);
      expect(locSetting.taskPath).toBe(fakedPath);
    });

    // No HTTP request expected - service returns local data via of() observable
    mockHttp.expectNone(locationUrl);
  }));

  it('should save location setting', fakeAsync(() => {
    service.saveLocation(LocationPath.AppSettingPath, fakedPath)
    .subscribe(isTrue => {
      expect(isTrue).toBe(true);
    });

    const req = mockHttp.expectOne({url: locationUrl, method: 'POST'});
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeDefined();
    expect(req.request.body.appSettingPath).toBe(fakedPath);

    // sent dummy data - any response will be mapped to true
    req.flush({success: true});
    mockHttp.verify();
  }));

  it('should save location setting is failed, 503', fakeAsync(() => {
    service.saveLocation(LocationPath.AppSettingPath, fakedPath)
    .subscribe({
      next: () => fail('Should have failed with 503 error'),
      error: (err) => {
        expect(err.status).toBe(503);
        expect(err.statusText).toBe('Bad request');
      }
    });

    const req = mockHttp.expectOne({url: locationUrl, method: 'POST'});
    expect(req.request.method).toBe('POST');

    // sent error response
    req.flush('Error occurred', {status: 503, statusText: 'Bad request'});
    mockHttp.verify();
  }));
});
