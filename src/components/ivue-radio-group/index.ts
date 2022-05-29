import { App } from 'vue';
import IvueRadioGroup from './index.vue';

export default (app: App): void => {
    app.component(IvueRadioGroup.name, IvueRadioGroup);
};

export { IvueRadioGroup };
