import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';

import { LocationPath, LocationSetting } from './location-setting.model';

@Injectable()
export class LocationService {

  private readonly _locSetting!: LocationSetting | {[prop: string]: string};

  constructor() {
    this._locSetting = new LocationSetting();
   }

   /**
    * Returns the stored paths of AppSettingPath and TaskPath in the LocationSetting construction.
    * @returns LocationSetting instance
    */
  public getLocationSetting(): Observable<LocationSetting> {
    return from(this._electronGetLocationPaths());
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

    try {
      (window as any).electronAPI.ipcLocation.save(pathType, this._locSetting);
      return of(true);
    } catch (error) {
      return throwError(error);
    }
  }

  /**
   * Return the location's patsh from electron/ipc-location.js via ipc communcation of electron
   * @returns Promise<LocationSetting>
   * @memberof Electron ipcLocation
   */
  private _electronGetLocationPaths(): Promise<LocationSetting> {
    return (window as any).electronAPI.ipcLocation.getPaths();
  }
}
