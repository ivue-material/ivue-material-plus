
import { App } from 'vue';
import IvueProgress from './index.vue';

export default (app: App): void => {
    app.component(IvueProgress.name, IvueProgress);
};

export { IvueProgress };
