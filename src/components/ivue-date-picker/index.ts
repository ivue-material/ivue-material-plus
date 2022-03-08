import { App } from 'vue';
import IvueDatePicker from './index.vue';

export default (app: App): void => {
    app.component(IvueDatePicker.name, IvueDatePicker);
};

export { IvueDatePicker };
