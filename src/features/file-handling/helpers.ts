import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

/** path is file and allowed extension */
export const isAllowedExtension = async (path: string, extensions: string[]): Promise<boolean> => {
    const ext = extname(path);

    return !!ext && (!extensions || extensions.includes(ext)) && (await stat(path)).isFile();
};

/** get all files directory and filtered by extensions */
export const getFilesOfDirectory = async (
    path: string,
    extensions: string[]
): Promise<string[]> => {
    const entries = await readdir(path);
    const files: string[] = [];

    for (const name of entries) {
        const fullPath = join(path, name);
        (await isAllowedExtension(fullPath, extensions)) && files.push(name);
    }

    return files;
};
