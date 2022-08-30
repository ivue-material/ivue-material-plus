import { App } from 'vue';
import IvueUpload from './index.vue';

export default (app: App): void => {
    app.component(IvueUpload.name, IvueUpload);
};

export { IvueUpload };
