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
}

module.exports = IpcTaskList;
