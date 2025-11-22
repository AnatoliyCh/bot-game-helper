import fs from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { copyFile, createArchive, getFilesOfDirectory, isAllowedExtension } from './helpers';
import type { WatcherConfig } from './Types';

const debounce = <T extends any[]>(fn: (...args: T) => Promise<void> | void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const result = fn(...args);
            result instanceof Promise && result.catch((err) => console.error(err));
        }, delay);
    };
};

const useWatch = async (cnf: WatcherConfig) => {
    await mkdir(cnf.watchDir, { recursive: true });
    await mkdir(cnf.saveDirFiles, { recursive: true });

    const files = new Set<string>(await getFilesOfDirectory(cnf.watchDir, cnf.extensions));
    const savedFiles: string[] = [];
    const watcher = fs.watch(
        cnf.watchDir,
        debounce(async (eventType, filename) => {
            if (!filename) {
                console.warn('fs.watch.filename is null');
                return;
            }

            const isRename = eventType === 'rename';

            // delete file
            if (isRename && files.has(filename)) {
                files.delete(filename);
                return;
            }

            // add file
            if ((isRename && !files.has(filename)) || eventType === 'change') {
                const fullPath = join(cnf.watchDir, filename);
                if (!(await isAllowedExtension(fullPath, cnf.extensions))) {
                    return;
                }

                isRename && files.add(filename);
                savedFiles.push(await copyFile(fullPath, cnf.saveDirFiles));

                // create archive and delete saved files
                if (savedFiles.length === cnf.countFilesInArchive) {
                    await createArchive(savedFiles);
                    await Promise.all([savedFiles.map((file) => Bun.file(file).delete())]);
                    savedFiles.length = 0;
                }
            }
        }, 50)
    );

    return { files: files as ReadonlySet<string>, watcher };
};

export default useWatch;
