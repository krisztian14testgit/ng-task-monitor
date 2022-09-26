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
   /**
    * Subscribes on the 'save-taskList' ipc channel to save the task items.
    * @invoke save(taskList) in preload.js
    * @return never
    */ 
   static subscribeOnSaving() {
        ipcMain.on('save-taskList', (event, taskList = []) => {
            const taskObj = { "taskList": taskList };
            const taskskStr = JSON.stringify(taskObj);

           try {
                // reading taskPath from the appSetting.json.
                const taskPath = this._getTaskPathFromAppSetting();
                this._changeTaskPath(taskPath);
                
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
     * @invoke getAll() in preload.js
     * @return Promise<array>
     */
    static getTaskList() {
        const TaskDate = require('../models/task-date');
        ipcMain.handle('load-taskList', () => {
            try {
                // reading taskPath from the appSetting.json.
                const taskPath = this._getTaskPathFromAppSetting();
                this._changeTaskPath(taskPath);

                const taskList = this._getTaskListFromFile();
                
                // removing those tasks which are older then 7 days (one week)
                return TaskDate.removeOldTaskByDate('_createdDate', taskList);
            } catch(err) {
                // returns empty task list via IPC event channel
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
            // reset the deafult task path file saving, not forget to use original way
            this._fileHandler.changeFilePath(this._locationDir + AppPath.TASK_FILE);
        }

        return taskPath;
    }

    /**
     * Changes the file path of the fileHandler where reads from the file
     * if the given task path is valid.
     * @param {*} taskPath 
     */
    static _changeTaskPath(taskPath) {
        if (taskPath && this._fileHandler.isExistedPath(taskPath)) {
            this._fileHandler.changeFilePath(taskPath + AppPath.TASK_FILE);
        }

    }

    /**
     * Returns the task items into array 
     * if "taskList" key exists in the taskList.json file, 
     * otherwise returns empty array.
     * @returns Task[]
     */
    static _getTaskListFromFile() {
        let retArray = [];
        const tasksString = this._fileHandler.readFile();
        const taskObj = JSON.parse(tasksString);

        if (taskObj.taskList) {
           retArray = taskObj.taskList;
        }

        return retArray;
    }
}

module.exports = IpcTaskList;
