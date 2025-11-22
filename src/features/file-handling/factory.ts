import type { config } from '../../shared/config';
import type { WatcherConfig } from './Types';

/** create {@link WatcherConfig} */
const getWatcherConfig = (cnfApp: typeof config): WatcherConfig => ({
    extensions: cnfApp.watchFileExtensions,
    ...cnfApp,
});

export default { getWatcherConfig };
