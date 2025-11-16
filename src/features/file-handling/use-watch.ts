import fs from 'node:fs';
import { copyFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { getFilesOfDirectory, isAllowedExtension } from './helpers';

const fileBackup = async (file: string, saveDir: string) => {
    await Bun.sleep(50); // fix resource busy or locked, copyfile
    const today = new Date();
    const formattedDate = `${today.getDate()}${
        today.getMonth() + 1
    }${today.getFullYear()}_${today.getHours()}-${today.getMinutes()}`;

    await copyFile(file, join(saveDir, `${formattedDate}${extname(file)}`));
};

const useWatch = async (watchDir: string, extensions: string[], saveDir: string) => {
    const files = new Set<string>(await getFilesOfDirectory(watchDir, extensions));
    await mkdir(saveDir, { recursive: true });

    const watcher = fs.watch(watchDir, async (eventType, filename) => {
        if (!filename) {
            console.warn('fs.watch.filename is null');
            return;
        }

        const isRename = eventType === 'rename';

        // delete file
        if (isRename && files.has(filename)) {
            files.delete(filename);
        }
        // add file
        else if ((isRename && !files.has(filename)) || eventType === 'change') {
            const fullPath = join(watchDir, filename);
            if (!(await isAllowedExtension(fullPath, extensions))) {
                return;
            }

            isRename && files.add(filename);
            await fileBackup(fullPath, saveDir);
        }
    });

    return { files: files as ReadonlySet<string>, watcher };
};

export default useWatch;
