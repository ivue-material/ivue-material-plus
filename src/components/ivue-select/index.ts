import { App } from 'vue';
import IvueSelect from './index.vue';

export default (app: App): void => {
    app.component(IvueSelect.name, IvueSelect);
};

export { IvueSelect };
