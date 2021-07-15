import { App } from 'vue';
import IvueUpLoad from './index.vue';

export default (app: App): void => {
    app.component(IvueUpLoad.name, IvueUpLoad);
};

export { IvueUpLoad };
