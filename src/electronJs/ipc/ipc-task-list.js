"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { ipcMain } = require('electron');
const NodeJSFileHandler = require('../file-handler/nodejs-file-handler');
const AppPath = require('../models/app-path');

class IpcTaskList {
   /** Contains the location path of the installed app. */
   static _locationDir = AppPath.getDirectory();
   static _fileHandler = new NodeJSFileHandler(this._locationDir + AppPath.TASK_FILE);
   /** Subscribes on the 'save-taskList' ipc channel to save the task items. */ 
   static subscribeOnSaving() {
        ipcMain.on('save-taskList', (event, taskList = []) => {
            const taskObj = { "taskList": taskList };
            const taskskStr = JSON.stringify(taskObj);

           try {
                // reading taskPath from the appSetting.json.
                const taskPath = this._getTaskPathFromAppSetting();
                
                // checnking the taskPath is valid to change file path
                if (taskPath && this._fileHandler.isExistedPath(taskPath)) {
                    // read task list from the adjusted task path
                    this._fileHandler.changeFilePath(taskPath + AppPath.TASK_FILE);
                }
                this._fileHandler.writeFile(taskskStr).then(() => {
                    console.log('SAVING TASKS SUCCESS');
                    return true;
                });
           } catch(err) {
                console.error(err);
                return err;
           }
        });
    }

    /**
     * Returns the task items from the taskList.json.
     * @return Promise<array>
     */
    static getTaskList() {
        const TaskDate = require('../models/task-date');
        ipcMain.handle('load-taskList', () => {
            try {
                // reading taskPath from the appSetting.json.
                const taskPath = this._getTaskPathFromAppSetting();

                // checnking the taskPath is valid to change file path
                if (taskPath && this._fileHandler.isExistedPath(taskPath)) {
                    // read task list from the adjusted task path
                    this._fileHandler.changeFilePath(taskPath + AppPath.TASK_FILE);
                }

                const strTasks = this._fileHandler.readFile();
                const taskObj = JSON.parse(strTasks);
                const taskList = taskObj.taskList ? taskObj.taskList: [];
                
                // removing those tasks which are older then 7 days (one week)
                return TaskDate.removeOldTaskByDate('_createdDate', taskList);
            } catch(err) {
                return [];
            }
        });
    }

    /**
     * Returns the task path from the appSetting.json if it exsits,
     * otherwise returns empty string.
     * @returns string
     */
    static _getTaskPathFromAppSetting() {
        const appSettingPath = this._locationDir + AppPath.APP_SETTING_FILE;
        let taskPath = '';
        if (this._fileHandler.isExistedPath(appSettingPath)) {
            this._fileHandler.changeFilePath(appSettingPath);
            const strLocSetting = this._fileHandler.readFile();
            taskPath = JSON.parse(strLocSetting)?.taskPath;
        }

        // reset the deafult task path
        this._fileHandler.changeFilePath(this._locationDir + AppPath.TASK_FILE);
        return taskPath;
    }
}

module.exports = IpcTaskList;
