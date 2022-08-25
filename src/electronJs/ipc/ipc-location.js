"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */


const { ipcMain } = require('electron');
const NodeJSFileHandler = require('../file-handler/nodejs-file-handler');
const AppPath = require('../models/app-path');

/**
 * Handles the ipc communication of the ng-task-monitor location with saving and returning paths.
 */
class IpcLocation {
    /** Contains the location path of the installed app. */
    static _locationDir = AppPath.getDirectory();
    static _fileHandler = new NodeJSFileHandler(this._locationDir + AppPath.APP_SETTING_FILE);
    /** Subscribes on the 'save-location' ipc channel to save the given path. */
    static subscribeOnSaving() {
        ipcMain.on('save-location', (event,
                                    pathType = 0,
                                    locationSetting = { appSettingPath: '', taskPath: '' }) => {
            let jsonStr = JSON.stringify(locationSetting);

            // pathType: LocationPath {AppSettingPath: 0, TaskPath: 1}
            // If AppSettingPath changed, create folder
            if (pathType === 0) {
                this._fileHandler.changeFilePath(locationSetting.appSettingPath + AppPath.APP_SETTING_FILE);
            }

            // just create empty task file.
            if (pathType === 1) {
                this._fileHandler.changeFilePath(locationSetting.taskPath + AppPath.TASK_FILE);
                jsonStr = '';
            }
            
            try {
                return this._fileHandler.writeFile(jsonStr).then(() => {
                    console.log('SAVING SUCCESS');
                    return true;
                });
            } catch(err) {
                console.log('ipc-location: GOT ERROR');
                return err;
            }
        });
    }

    /**
     * Returns the LocationSetting structure of application.
     * AppSettingPath and TaskPath will be filled in with paths.
     * @return Promise<locationSetting object>
     */
    static getLocationPaths() {
        ipcMain.handle('load-location', () => {
            let locationSetting = {
                appSettingPath: this._locationDir,
                taskPath: this._locationDir
            };
            
            try {
                // read taskPath from the appSetting.json.
                const strLocSetting = this._fileHandler.readFile();
                locationSetting = JSON.parse(strLocSetting);

                // if tha taskPath does not exist, set default locationDir
                if (!locationSetting.taskPath && !this._fileHandler.isExistedPath(locationSetting.taskPath)) {
                    locationSetting.taskPath = this._locationDir;
                }

                // if tha appSetting path does not exist, set default locationDir
                if (!locationSetting.appSettingPath && !this._fileHandler.isExistedPath(locationSetting.appSettingPath)) {
                    locationSetting.appSettingPath = this._locationDir;
                }

                return locationSetting;
            } catch (err) {
                // if it is error, returns default location dictionary.
                return locationSetting;
            }
        });
    }
}

module.exports = IpcLocation;
