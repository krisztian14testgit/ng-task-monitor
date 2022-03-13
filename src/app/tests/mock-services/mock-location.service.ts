import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { LocationPath, LocationSetting } from "src/app/modules/change-location/services/location/location-setting.model";

/**
 * Contains the Mocked class with mocked methods which are base on LocationService.
 */
@Injectable()
export class MockLocationService {
    public readonly defaultPath: string;
    public readonly locSetting!: LocationSetting | {[prop: string]: string};
    constructor() {
        this.defaultPath = 'C:/fakedUser/fakedPath/';

        this.locSetting = new LocationSetting();
        this.locSetting.appSettingPath = this.defaultPath;
        this.locSetting.taskPath = this.defaultPath;
    }

    /**
     * Returns the stored paths of AppSettingPath and TaskPath in the LocationSetting construction.
     * @returns LocationSetting instance
     */
    public getLocationSetting(): Observable<LocationSetting> {
        return of(this.locSetting as LocationSetting);
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
        (this.locSetting as {[prop: string]: string})[keyProperty] = path;
        return of(true);
    }
}