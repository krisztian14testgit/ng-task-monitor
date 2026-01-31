import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { LocationPath, LocationSetting } from './location-setting.model';
import ServiceBase from 'src/app/services/service-base';

@Injectable()
export class LocationService {

  private readonly _defaultPath: string;
  private readonly _locSetting!: LocationSetting | {[prop: string]: string};
  private readonly _locationUrl = `${environment.host}location`;
  private readonly _isElectron: boolean;

   constructor(private readonly http: HttpClient) {
    this._defaultPath = 'C:/Users/../Documents/';

    this._locSetting = new LocationSetting();
    this._locSetting.appSettingPath = this._defaultPath;
    this._locSetting.taskPath = this._defaultPath;
    
    // Check if running in Electron
    this._isElectron = !!(window && window.electronAPI);
   }

   /**
    * Returns the stored paths of AppSettingPath and TaskPath in the LocationSetting construction.
    * @returns LocationSetting instance
    */
  public getLocationSetting(): Observable<LocationSetting> {
    // If running in Electron, use Electron API
    if (this._isElectron) {
      return from(this._electronGetLocationPaths());
    }
    
    // Otherwise use HTTP (web version)
    // return this.http.get<LocationSetting>(this._locationUrl, {headers: ServiceBase.HttpHeaders});
    
    // TODO: temporary solution until the micro service is not done
    return of(this._locSetting as LocationSetting);
  }

  /**
   * Saves the given path by pathType.
   * Returns true the saving process is succeed.
   * 
   * @param pathType It can be LocationPath.AppSettingPath or LocationPath.TaskPath.
   * @param path The path to be stored.
   * @returns boolean
   */
  public saveLocation(pathType: LocationPath, path: string): Observable<boolean> {
    // get enum name
    let keyProperty = LocationPath[pathType];

    // first char to be lowerCase
    const firstChar = keyProperty[0].toLowerCase();
    keyProperty = firstChar + keyProperty.substring(1);

    /*if (pathType === LocationPath.AppSettingPath) {
      this._locSetting.appSettingPath = path;
    } else {
      this._locSetting.appSettingPath = path;
    }*/
    // avoiding if condition above
    (this._locSetting as {[prop: string]: string})[keyProperty] = path;
    
    // If running in Electron, use Electron API
    if (this._isElectron) {
      try {
        this._electronSaveLocationPaths(pathType, this._locSetting as LocationSetting);
        return of(true);
      } catch (error) {
        return throwError(() => error);
      }
    }
    
    // Otherwise use HTTP (web version)
    return this.http.post(this._locationUrl, this._locSetting, {headers: ServiceBase.HttpHeaders})
    .pipe(map(_ => true));
  }

  /**
   * Saving the appSettingPath or TaskPath by the given pathType via electron/ipc-location communication.
   * @param pathType It can be LocationPath.AppSettingPath or LocationPath.TaskPath.
   * @param locSetting It contains the appSettingPath and TaskPath.
   * @returns Promise<boolean>
   */
  private _electronSaveLocationPaths(pathType: LocationPath, locSetting: LocationSetting): Promise<boolean> {
    try {
      if (!window.electronAPI) {
        return Promise.reject(new Error('Electron API is not available'));
      }
      // sending data to save via ipc, return NOTHING, not throw error
      window.electronAPI.ipcLocation.save(pathType, locSetting);
      return Promise.resolve(true);
    } catch(err) {
      return Promise.reject(err);
    }
  }

  /**
   * Return the location's paths from electron/ipc-location.js via ipc communication of electron
   * @returns Promise<LocationSetting>
   * @memberof Electron ipcLocation
   */
  private _electronGetLocationPaths(): Promise<LocationSetting> {
    if (!window.electronAPI) {
      return Promise.reject(new Error('Electron API is not available'));
    }
    return window.electronAPI.ipcLocation.getPaths();
  }
}
