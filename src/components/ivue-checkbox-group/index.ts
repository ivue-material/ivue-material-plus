import { App } from 'vue';
import IvueCheckboxGroup from './index.vue';

export default (app: App): void => {
    app.component(IvueCheckboxGroup.name, IvueCheckboxGroup);
};

export { IvueCheckboxGroup };
