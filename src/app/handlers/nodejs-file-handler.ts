// nodejs: fs, path module importing
import * as fs from 'fs';
import * as fsPath from 'path';

/**
 * FileHandler instance can read and write the file by the given path 
 * base on NodeJs fs module.
 * It is also able to make prev checking before writing file.
 * 
 * @Todo using NodeJs file disciptor and path
 */
export class NodeJSFileHandler {
    /** 
     * Set the path of the location where you want to read/write your created file. 
     * @param path: The path of the directory.
     */
    constructor(public path: string) {}

    /**
     * Writes the file with given content.
     * The previous content of the file won't be lose, it is preserved!
     * @param content The given text will be stored.
     * @returns Promise: boolean
     */
    public writeFile(content: string): Promise<boolean> {
        this.checkPath();
        
        // get content from file, beacuse not lose previous content.
        const prevContent = this.readFile();
        if (prevContent !== '') {
            content = prevContent + content;
        }
        
        // flag: w => Reading and writing, positioning the stream at the beginning of the file. The file is created if it does not exist.
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, content, {flag: 'w+'}, (err: NodeJS.ErrnoException | null) => {
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
    public readFile(): string {
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
     * Returns the calculated path of the given piece/incomplete path.
     * @param path The location path.
     * @returns string of the full path.
     */
    public static getFullPathFromPieces(piecePath: string): string {
        return fsPath.normalize(piecePath);
    }

    /** Throwing error if the local path is empty. */
    private checkPath(): void {
        if (this.path.trim() === '') {
            throw console.error('File path is empty! Set it in the constructor!');
        }
    }

    private isPathEndFolder(): Promise<boolean> {
        this.checkPath();
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fs.stat(this.path, (err: NodeJS.ErrnoException | null, stats: any) => {
                if (err) {
                    console.error(err);
                    return reject(false);
                }
    
                return resolve(stats.isDirectory());
            });
        });
    }
}
