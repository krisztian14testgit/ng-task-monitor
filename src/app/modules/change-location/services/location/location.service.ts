import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocationSetting } from './location-setting';
import ServiceBase from 'src/app/services/service-base';

export enum LocationPath {
  AppSettingPath,
  TaskPath
}

@Injectable()
export class LocationService {

  private readonly _defaultPath: string;
  private readonly _locSetting!: LocationSetting | {[prop: string]: string};
  private readonly _locationUrl = 'http://localhost:8080/location';

  constructor(private readonly http: HttpClient) {
    this._defaultPath = 'C:/Users/../Documents/';

    this._locSetting = new LocationSetting();
    this._locSetting.appSettingPath = this._defaultPath;
    this._locSetting.taskPath = this._defaultPath;
   }

   /**
    * Returns the stored paths of AppSettingPath and TaskPath in the LocationSetting construction.
    * @returns LocationSetting instance
    */
  public getLocationSetting(): Observable<LocationSetting> {
    // return this.http.get<LocationSetting>(this._locationUrl, {headers: ServiceBase.HttpHeaders});
    return of(this._locSetting as LocationSetting);
  }

  /**
   * Saves the given path by pathType.
   * Returns true the saving process is succed.
   * 
   * @param pathType It can be LocationPath.AppSettingPath or LocationPath.TaskPath.
   * @param path The path to be stored.
   * @returns boolean
   */
  public saveLocation(pathType: LocationPath, path: string): Observable<boolean> {
    let keyProperty = LocationPath[pathType]; // get enum name

    // first char to be lowerCase
    const firstChar = keyProperty[0].toLowerCase();
    keyProperty = firstChar + keyProperty.substring(1);

    /*if (pathType === LocationPath.AppSettingPath) {
      this._locSetting.appSettingPath = path;
    } else {
      this._locSetting.appSettingPath = path;
    }*/
    // avoiding if condition
    (this._locSetting as {[prop: string]: string})[keyProperty] = path;
    
    return this.http.post(this._locationUrl, this._locSetting, {headers: ServiceBase.HttpHeaders})
    .pipe(map(_ => true));
  }
}
