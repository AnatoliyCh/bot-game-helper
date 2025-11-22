const config = {
    watchDir: (process.env.WATCH_DIR ?? null) as string,
    watchFileExtensions:
        process.env.WATCH_FILE_EXTENSIONS?.split(',').map((ext) => ext.trim()) || [],
    saveDirFiles: (process.env.SAVE_DIR_FILES ?? null) as string,
    fileArchiver: (process.env['7Z'] ?? null) as string,
    saveDirArchives: (process.env.SAVE_DIR_ARCHIVES ?? null) as string,
    countFilesInArchive: Number(process.env.COUNT_FILES_IN_ARCHIVE),
};

const validation = () => {
    const errors: string[] = [];
    const nullOrEmpty = 'null or empty';

    !config.watchDir && errors.push(`WATCH_DIR ${nullOrEmpty}`);
    !config.saveDirFiles && errors.push(`SAVE_DIR_FILES ${nullOrEmpty}`);
    !config.fileArchiver && errors.push(`7Z ${nullOrEmpty}`);
    !config.saveDirArchives && errors.push(`SAVE_DIR_ARCHIVES ${nullOrEmpty}`);
    !config.countFilesInArchive ||
        (Number.isNaN(config.countFilesInArchive) &&
            errors.push(`COUNT_FILES_IN_ARCHIVE ${nullOrEmpty}`));

    if (errors.length) {
        for (const error of errors) {
            console.error(error);
        }
    }

    return { errors, hasError: errors.length };
};

export { config, validation };
