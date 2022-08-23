/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
"use strict";

const { ipcMain } = require('electron');
const NodeJSFileHandler = require('../file-handler/nodejs-file-handler');

const APP_SETTING_FILE = 'appSetting.json';
const TASK_FILE = 'taskList.json';

/**
 * Handles the ipc communication of the ng-task-monitor location with saving and returning paths.
 */
class IpcLocation {
    /** Contains the location path of the installed app. */
    static _locationDir = this._getAppDirectory();
    static _fileHandler = new NodeJSFileHandler(this._locationDir + APP_SETTING_FILE);
    static subscribeOnSaving() {
        ipcMain.on('save-location', (event,
                                    pathType = 0,
                                    locationSetting = { appSettingPath: '', taskPath: '' }) => {
            const locationStr = JSON.stringify(locationSetting);

            // If AppSettingPath changed, create folder
            if (pathType === 0) {
                this._fileHandler.changeFilePath(locationSetting.appSettingPath + APP_SETTING_FILE);
            }
            
            try {
                this._fileHandler.writeFile(locationStr).then(() => {
                    console.log('SAVING SUCCESS');
                    return true;
                });
            } catch(err) {
                console.error(err);
                return err;
            }
        });
    }

    /**
     * Return the LocationSetting structure of application.
     * AppSettingPath and TaskPath will be filled in with default paths.
     */
    static getLocationPaths() {
        ipcMain.handle('load-location', () => {
            const locationSetting = { appSettingPath: '', taskPath: '' };
            locationSetting.appSettingPath = this._locationDir;
            locationSetting.taskPath = this._locationDir;
            return locationSetting;
        });
    }

    /**
     * Returns the directory path of the Application.
     * @returns string
     */
    static _getAppDirectory() {
        // find all '\' signs by regExp
        const regExp = /\\/g;
        let appDir = __dirname.replace(regExp, '/');
        const indexOfSrc = appDir.indexOf('src');
        appDir = appDir.substring(0, indexOfSrc);
        return appDir + 'storer/';
    }
}

module.exports = IpcLocation;
