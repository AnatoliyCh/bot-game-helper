import fs from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { copyFile, getFilesOfDirectory, isAllowedExtension } from './helpers';
import type { WatchConfig } from './Types';

const useWatch = async (cnf: WatchConfig) => {
    const files = new Set<string>(await getFilesOfDirectory(cnf.watchDir, cnf.extensions));
    await mkdir(cnf.saveDir, { recursive: true });

    const watcher = fs.watch(cnf.watchDir, async (eventType, filename) => {
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
            await copyFile(fullPath, cnf.saveDir);
        }
    });

    return { files: files as ReadonlySet<string>, watcher };
};

export default useWatch;
