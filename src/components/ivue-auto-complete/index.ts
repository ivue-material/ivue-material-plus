import { App } from 'vue';
import IvueAutoComplete from './index.vue';

export default (app: App): void => {
    app.component(IvueAutoComplete.name, IvueAutoComplete);
};

export { IvueAutoComplete };
