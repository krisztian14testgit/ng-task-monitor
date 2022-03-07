// nodejs: fs, path module importing
const fs = require('fs');
const os = require('os');

/**
 * FileHandler instance can read and write the file by the given path 
 * base on NodeJs fs module.
 * It is also able to make prev checking before writing file.
 * 
 * @Todo using NodeJs file disciptor and path
 */
class NodeJSFileHandler {

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
     * The previous content of the file won't be lose, it is preserved!
     * @param content The given text will be stored.
     * @returns Promise: boolean
     */
    writeFile(content = '') {
        this.checkPath();
        
        // get content from file, beacuse not lose previous content.
        const prevContent = this.readFile();
        if (prevContent !== '') {
            content = prevContent + content;
        }
        
        // flag: w => Reading and writing, positioning the stream at the beginning of the file. The file is created if it does not exist.
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, content, {flag: 'w+'}, err => {
                if (err) {
                    console.error(err);
                    return reject(false);
                }
    
                //file written successfully
                return resolve(true);
            });        

        });
    }

    /**
     * Returns the read content of the file by adjusted path.
     * @returns string
     */
    readFile() {
        this.checkPath();
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return data.toString();
        } catch (error) {
            console.error(error);
        }

        return '';
    }

    /**
     * Return the path to the home directory of the current user.
     * @returns string path
     * @memberof NodeJs.os
     */
    static getHomeDir() {
        return os.homedir();
    }

    /** Throwing error if the local path is empty. */
    checkPath() {
        if (this.path.trim() === '') {
            throw console.error('File path is empty! Set it in the constructor!');
        }
    }

    _isPathEndFolder() {
        this.checkPath();
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