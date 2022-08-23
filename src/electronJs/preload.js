"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { contextBridge, ipcRenderer } = require('electron');

const locationPath = {
    /** 
     * Saves the location path via 'save-locaiton' channel, promise request.
     * Handle: async - await scope.
     * @param locationSetting It has two defined paths. AppSettingPath and, taskPath
     * @returns Promise<void>
     */
    save: (locationSetting = { appSettingPath: '', taskPath: '' }) => {
        ipcRenderer.send('save-location', locationSetting);
    },
    /**
     * Returns the current path by the given pathType.
     * Handle: async - await scope.
     * @param pathType  Default value: AppSettingPath: 0, Other value is TaskPath: 1.
     * @returns Promise<string>
     */
    get: (pathType = 0) => ipcRenderer.invoke('load-location', pathType)
};

contextBridge.exposeInMainWorld('electronAPI', {
    ipcLocation: locationPath
});
