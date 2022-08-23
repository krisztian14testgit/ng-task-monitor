"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { contextBridge, ipcRenderer } = require('electron');

const locationPath = {
    /** 
     * Saves the location paths via 'save-locaiton' channel, promise request.
     * locationSetting has appSettingPath and taskPath.
     * Handle: async - await scope.
     * @param locationSetting It has two defined paths. AppSettingPath and, taskPath
     * @returns Promise<void>
     */
    save: (locationSetting = { appSettingPath: '', taskPath: '' }) => {
        ipcRenderer.send('save-location', locationSetting);
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
