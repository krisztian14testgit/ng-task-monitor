/* eslint-disable no-undef */
"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcMain } = require('electron');

class IpcLocation {
    
    static subscribeOnSaving() {
        ipcMain.on('save-location', (event, locationSetting = { appSettingPath: '', taskPath: '' }) => {
            console.log('locSetting to be saved=', locationSetting);
        });
    }
}

module.exports = IpcLocation;
