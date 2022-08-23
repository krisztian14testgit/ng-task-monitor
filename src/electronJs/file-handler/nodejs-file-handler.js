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
            fs.writeFile(this.path, content, 'utf8', err => {
                if (err) {
                    console.error(err);
                    throw Error(err);
                }
    
                // file written successfully
                return resolve(true);
            });

        });
    }

    /**
     * Returns the content of the file by adjusted path.
     * @returns string
     */
    readFile() {
        this.checkEmptyPath();
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return data.toString();
        } catch (error) {
            console.error(error);
            return Promise.resolve('The file not found!');
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
            throw console.error('File path is empty! Set it in the constructor!');
        }
    }

    /**
     * Change the prevous adjusted path.
     * It can be create a new folders line. It depends on the path string.
     * @param newPath The path of the directory.
     */
    changeFilePath(newPath = '') {
        if (newPath) {
            this.path = newPath;
        }
    }

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
