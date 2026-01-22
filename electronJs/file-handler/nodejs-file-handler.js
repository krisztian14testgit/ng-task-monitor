"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// nodejs: fs, path module importing
const fs = require('fs');
const os = require('os');

/**
 * FileHandler class reads and writes the file by the given path 
 * base on NodeJs fs module.
 * It is also able to make previous checking before writing file.
 * 
 * @Todo using NodeJs file system and path
 */
class NodeJSFileHandler {

    /** The path of the file. */
    path = '';
    /** 
     * Set the path of the location where you want to read/write your created file. 
     * @param path: The path of the directory.
     */
    constructor(path = '') {
        this.path = path;
    }

    /**
     * Writes the file with given content.
     * The previous content will be lose. Re-write it.
     * @param content The given text will be stored.
     * @returns Promise: boolean
     */
    writeFile(content = '') {
        this.checkEmptyPath();
        
        // get content from file, beacuse not lose previous content.
        /*const prevContent = this.readFile();
        if (prevContent !== '') {
            content = prevContent + content;
        }*/
        
        // flag: w => Reading and writing, positioning the stream at the beginning of the file.
        // The file is created if it does not exist.
        return new Promise((resolve, reject) => {
            // async writing file
            fs.writeFile(this.path, content, 'utf8', err => {
                if (err) {
                    console.error(err);
                    throw new Error(err);
                }
    
                // file written successfully
                return resolve(true);
            });

        });
    }

    /**
     * Returns the content of the file by adjusted path.
     * The path is adjusted when creating an instance from the class or 
     * calling changeFilePath method.
     * @returns string
     */
    readFile() {
        this.checkEmptyPath();
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return data.toString();
        } catch (error) {
            console.error(error);
            return Promise.reject('The file not found!');
        }
    }

    /**
     * Removes the the file by the given filePath.
     * @param filePath The path of the file to be removed.
     * @returns Promise<never>
     */
    removeFile(filePath = '') {
        try {
            if (filePath) {
                // async removing file.
                return new Promise((resolve) => {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(err);
                            throw new Error(err);
                        }
            
                        // removing successfully
                        return resolve();
                    });
                });
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(`The file not found to remove it: Path: ${filePath}!`);
        }
    }

    /**
     * Return the path to the home directory of the current user.
     * @returns string path
     * @memberof NodeJs.os
     */
    getHomeDir() {
        return os.homedir();
    }

    /** Throwing error if the local path is empty. */
    checkEmptyPath() {
        if (this.path.trim() === '') {
            throw new Error('File path is empty! Set it in the constructor!');
        }
    }

    /**
     * Change the prevous adjusted path if you want to read/write file from the different path.
     * It has to be called before reading or writing file.
     * @param newPath The path of the directory.
     */
    changeFilePath(newPath = '') {
        if (newPath) {
            this.path = newPath;
        }
    }

    /** Returns true if the path is existed, otherwise returns false. */
    isExistedPath(path = '') {
        return fs.existsSync(path);
    }

    // checking the end of the path is dictionary
    _isPathEndFolder() {
        this.checkEmptyPath();
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fs.stat(this.path, (err, stats) => {
                if (err) {
                    console.error(err);
                    return reject(false);
                }
    
                return resolve(stats.isDirectory());
            });
        });
    }
}

module.exports = NodeJSFileHandler;
