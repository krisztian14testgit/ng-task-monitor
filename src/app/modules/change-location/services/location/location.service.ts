import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LocationPath, LocationSetting } from './location-setting.model';

@Injectable()
export class LocationService {

  private readonly _locSetting!: LocationSetting | {[prop: string]: string};
  private readonly _locationUrl = `${environment.host}location`;

  constructor(private readonly http: HttpClient) {
    this._locSetting = new LocationSetting();
   }

   /**
    * Returns the stored paths of AppSettingPath and TaskPath in the LocationSetting construction.
    * @returns LocationSetting instance
    */
  public getLocationSetting(): Promise<LocationSetting> {
    // return this.http.get<LocationSetting>(this._locationUrl, {headers: ServiceBase.HttpHeaders});
    
    // return the location's patsh from electron/ipc-location.js via ipc communcation
    return (window as any).electronAPI.ipcLocation.getPaths();
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
    
    (window as any).electronAPI.ipcLocation.save(this._locSetting);
    return of(true);
  }
}
