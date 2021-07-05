import { App } from 'vue';
import IvueSelect from './index.vue';
import IvueOption from './option.vue';
import IvueOptionGroup from './option-group.vue';

export default (app: App): void => {
    app.component(IvueSelect.name, IvueSelect);
    app.component(IvueOption.name, IvueOption);
    app.component(IvueOptionGroup.name, IvueOptionGroup);

};

export { IvueSelect, IvueOption, IvueOptionGroup };
