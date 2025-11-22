import { spawn } from 'bun';
import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { config } from '../../shared/config';
import sharedHelpers from '../../shared/helpers';

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

/** copying a file */
export const copyFile = async (filePath: string, saveDir: string): Promise<string> => {
    const newFilePath = join(
        saveDir,
        [sharedHelpers.formatDate(new Date(), 'yyyyMMdd_mm_ss'), extname(filePath)].join('')
    );
    await Bun.write(newFilePath, await Bun.file(filePath).arrayBuffer());

    return newFilePath;
};

export const createArchive = async (files: string[]) => {
    const archivePath = join(
        config.saveDirArchives,
        sharedHelpers.formatDate(new Date(), 'yyyyMMdd_mm_ss')
    );
    const proc = spawn({
        cmd: [config.fileArchiver, 'a', '-mx9', archivePath, ...files],
        stdout: 'inherit',
        stderr: 'inherit',
    });

    const exit = await proc.exited;
    if (exit !== 0) throw new Error('7Z error');
};
