"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { contextBridge, ipcRenderer } = require('electron');

const locationPath = {
    /** 
     * Saves the location paths via 'save-location' channel, promise request.
     * locationSetting has appSettingPath and taskPath.
     * Handle: async - await scope.
     * @param pathType Default is appSettingPath = 0. It can be taskPath = 1
     * @param locationSetting It has two defined paths. AppSettingPath and, taskPath
     * @using app/modules/change-location/service/location/location.service
     * @returns Promise<void>
     */
    save: (pathType = 0, locationSetting = { appSettingPath: '', taskPath: '' }) => {
        ipcRenderer.send('save-location', pathType, locationSetting);
    },
    /**
     * Returns the locationSetting object via 'load-location' channel, promise request.
     * It has two paths: appSettingPath and taskPath.
     * Handle: async - await scope.
     * @using app/modules/change-location/service/location/location.service
     * @returns Promise<object>
     */
    getPaths: () => ipcRenderer.invoke('load-location')
};

const taskList = {
    /**
     * Saves the given task list via 'save-taskList' channel, promise request.
     * Handle: async - await scope.
     * @param taskList the task items
     * @using app/modules/task/service/task.service
     * @returns Promise<void>
     */
    save: (taskList = []) => ipcRenderer.send('save-taskList', taskList),
    /**
     * Returns the task items into array, via 'load-taskList' channel, promise request.
     * Handle: async - await scope.
     * @using app/modules/task/service/task.service
     * @returns Promise<array>
     */
    getAll: () => ipcRenderer.invoke('load-taskList')
};

// Contains different IPC(Inter-Process-Communication) channels for task and location service.
contextBridge.exposeInMainWorld('electronAPI', {
    ipcLocation: locationPath,
    ipcTaskList: taskList
});
