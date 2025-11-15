import { validation } from './shared/config';

if (validation().hasError) {
    process.exit(0);
}
