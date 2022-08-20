"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

/** 
 * The started point of the electron app.
 * There is main window definition.
 */

const {app, BrowserWindow} = require('electron');
const url = require("url");
const path = require("path");

let mainWindow;
const startedPage = '../../dist/ng-task-monitor/index.html';

const indexUrl = url.format(path.join(__dirname, startedPage), {
    protocol: 'file',
    slashes: true,
});

/** How to creata default eletron window */
function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            sandbox: true, // for the securty reason: def OS file system
            // preload: path.join(__dirname, 'src/electronJs/preload.js'),
        }
    });

    // load the url of the startedPage, which you can see on the window.
    mainWindow.loadURL(indexUrl);

    // Open the DevTools.(f12)
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // open/close the DevTools window by f12
    let isOpenDevTool = false;
    let devToolMethod = 'openDevTools';
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.type === 'keyDown' && input.key === 'F12') {
            devToolMethod = !isOpenDevTool ? 'openDevTools' : 'closeDevTools';
            mainWindow.webContents[devToolMethod]();
            console.log(devToolMethod);
            isOpenDevTool = !isOpenDevTool;
        }
    });
}

// The app is ready creating an window
app.whenReady().then(() => {
    /** ipc protocol here*/
    // FileSave.subscribeOnSavingInput('./src/electronJs/input.txt');

    /** creating window */
    createWindow();

    // for Mac: mac app running in background without any window is open.
    //  Activating the app when no windows are available should open a new one.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quitting the app diff in Mac OS
/** There are three supported platform:
 * windows 	=> win32
 * Linux 	=> linux
 * macOs 	=> darwin
 */
app.on('window-all-closed', function () {
    // if it is not Mac, quitting the app,
    if (process.platform !== 'darwin') { app.quit(); }
});
