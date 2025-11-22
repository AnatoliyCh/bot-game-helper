import type { config } from '../../../shared/config';

/** watcher config */
export type WatcherConfig = Pick<
    typeof config,
    'watchDir' | 'saveDirFiles' | 'fileArchiver' | 'countFilesInArchive'
> & { extensions: string[] };
