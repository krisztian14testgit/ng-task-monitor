"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { contextBridge, ipcRenderer } = require('electron');

const locationPath = {
    /** 
     * Saves the location paths via 'save-locaiton' channel, promise request.
     * locationSetting has appSettingPath and taskPath.
     * Handle: async - await scope.
     * @param pathType Default is appSettingPath = 0. It can be taskPath = 1
     * @param locationSetting It has two defined paths. AppSettingPath and, taskPath
     * @returns Promise<void>
     */
    save: (pathType = 0, locationSetting = { appSettingPath: '', taskPath: '' }) => {
        ipcRenderer.send('save-location', pathType, locationSetting);
    },
    /**
     * Returns the locationSetting object via 'load-location' channel, promise request.
     * It has two paths: appSettingPath and taskPath.
     * Handle: async - await scope.
     * @returns Promise<object>
     */
    getPaths: () => ipcRenderer.invoke('load-location')
};

contextBridge.exposeInMainWorld('electronAPI', {
    ipcLocation: locationPath
});
