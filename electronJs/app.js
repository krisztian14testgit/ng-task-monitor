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
const IpcLocation = require('./ipc/ipc-location');
const IpcTaskList = require('./ipc/ipc-task-list');

/** Stores the needles of the Electron window obj. */
let mainWindow = undefined;
const startedPage = '../dist/ng-task-monitor/index.html';

const indexUrl = url.format(path.join(__dirname, startedPage), {
    protocol: 'file',
    slashes: true,
});
/** Contains true if one instance is already running of window. */
const isAppInstanceLocked = app.requestSingleInstanceLock();

/** Creating default eletron window. */
function createBrowserWindow() {
    return  new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            // for the securty reason: defensee OS file system
            sandbox: true,
            // attaching preload.js shares the data to renderer process.
            preload: path.join(__dirname, 'preload.js'),
        }
    });
}

/**
 * Open/close the DevTools window by f12 button.
 * Default: DevTools is closed.
 */
function devToolController(mainWindow) {
    if (mainWindow) {
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
}

/** Opening eletron window. */
function openWindow () {
    mainWindow = createBrowserWindow();

    // clear session chache of chromium
    mainWindow.webContents.clearHistory();
    mainWindow.webContents.session.clearCache().then(() => {
        console.log('Electron.js session cache has been cleaned');
    });

    // load the url of the startedPage, which you can see on the window.
    mainWindow.loadURL(indexUrl);

    // Open the DevTools.(f12)
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // open/close the DevTools window by f12
    devToolController(mainWindow);
}

// If there is one isntance running, other will be closed.
if (!isAppInstanceLocked) {
    app.quit();
    return;
}

// The app is ready opening main window
app.whenReady().then(() => {
    /** ipc protocol here*/
    IpcLocation.subscribeOnSaving();
    IpcLocation.getLocationPaths();
    IpcTaskList.subscribeOnSaving();
    IpcTaskList.getTaskList();

    /** open mian window */
    openWindow();

    // for Mac: mac app running in background without any window is open.
    //  Activating the app when no windows are available should open a new one.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            openWindow();
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
