import type { config } from '../../shared/config';
import type { WatchConfig } from './Types';

/** create {@link WatchConfig} */
const getWatchConfig = (cnfApp: typeof config): WatchConfig => ({
    extensions: cnfApp.watchFileExtensions,
    ...cnfApp,
});

export default { getWatchConfig };
