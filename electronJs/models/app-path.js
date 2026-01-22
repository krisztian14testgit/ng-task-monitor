"use strict";
/* eslint-disable no-undef */

class AppPath {
    static APP_SETTING_FILE = 'appSetting.json';
    static TASK_FILE = 'taskList.json';


    /**
     * Returns the default directory path of the Application.
     * @returns string
     */
    static getDirectory() {
        // find all '\' signs by regExp
        const regExp = /\\/g;
        let appDir = __dirname.replace(regExp, '/');
        const indexOfSrc = appDir.indexOf('src');
        appDir = appDir.substring(0, indexOfSrc);
        return appDir + 'storer/';
    }
}

module.exports = AppPath;
