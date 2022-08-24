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
        ipcMain.handle('load-taskList', () => {
            // read task list from the taskList.json.
            const strTasks = this._fileHandler.readFile();
            const taskObj = JSON.parse(strTasks);
            return taskObj.taskList ? taskObj.taskList: [];
        });
    }
}

module.exports = IpcTaskList;
