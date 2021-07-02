import { App } from 'vue';
import IvueSelect from './index.vue';
import IvueOption from './option.vue';

export default (app: App): void => {
    app.component(IvueSelect.name, IvueSelect);
    app.component(IvueOption.name, IvueOption);

};

export { IvueSelect, IvueOption };
