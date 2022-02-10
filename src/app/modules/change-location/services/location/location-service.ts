import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FileHandler } from 'src/app/handlers/file-handler';
import { LocationSetting } from './location-setting';

export enum LocationPath {
  AppSettingPath,
  TaskPath
}

@Injectable()
export class LocationService {

  private _defaultPath: string;
  private _locSetting!: LocationSetting | {[prop: string]: string};

  constructor(private _fileHandler: FileHandler) {
    this._defaultPath = 'C:/Users/../Documents/';

    this._locSetting = new LocationSetting();
    this._locSetting.appSettingPath = this.DefaultFullPath;
    this._locSetting.taskPath = this.DefaultFullPath;
   }

  public get DefaultFullPath(): string {
    return this._fileHandler.getFullPathFromPieces(this._defaultPath);
  }

  public savePath(pathType: LocationPath, path: string): Observable<boolean> {
    let keyProperty = LocationPath[pathType]; // get enum name
    
    const firstChar = keyProperty[0].toLowerCase();
    keyProperty = firstChar + keyProperty.substring(1);

    /*if (pathType === LocationPath.AppSettingPath) {
      this._locSetting.appSettingPath = path;
    } else {
      this._locSetting.appSettingPath = path;
    }*/
    // avoiding if condition
    (this._locSetting as {[prop: string]: string})[keyProperty] = path;
    const jsonText = JSON.stringify(this._locSetting);
    
    // convert Promsie to Observable
    return from(this._fileHandler.writeFile(jsonText));
  }
}
