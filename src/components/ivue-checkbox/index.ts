import { App } from 'vue';
import IvueCheckbox from './index.vue';

export default (app: App): void => {
    app.component(IvueCheckbox.name, IvueCheckbox);
};

export { IvueCheckbox };
