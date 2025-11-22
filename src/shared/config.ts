const config = {
    watchDir: (process.env.WATCH_DIR ?? null) as string,
    watchFileExtensions:
        process.env.WATCH_FILE_EXTENSIONS?.split(',').map((ext) => ext.trim()) || [],
    saveDir: (process.env.SAVE_DIR ?? null) as string,
    fileArchiver: process.env['7z'] as string,
};

const validation = () => {
    const errors: string[] = [];
    const nullOrEmpty = 'null or empty';

    !config.watchDir && errors.push(`WATCH_DIR ${nullOrEmpty}`);
    !config.saveDir && errors.push(`SAVE_DIR ${nullOrEmpty}`);
    !config['fileArchiver'] && errors.push(`7z ${nullOrEmpty}`);

    if (errors.length) {
        for (const error of errors) {
            console.error(error);
        }
    }

    return { errors, hasError: errors.length };
};

export { config, validation };
