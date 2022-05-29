import { App } from 'vue';
import IvueRadio from './index.vue';

export default (app: App): void => {
    app.component(IvueRadio.name, IvueRadio);
};

export { IvueRadio };
