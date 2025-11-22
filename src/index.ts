import * as fh from './features/file-handling';
import { config, validation } from './shared/config';

if (validation().hasError) {
    console.log('Stopping...');
    process.exit(0);
}

process.on('SIGINT', () => {
    console.log('Stopping...');
    process.exit(0);
});

console.log('config', config);

await fh.useWatch(fh.factory.getWatchConfig(config));
