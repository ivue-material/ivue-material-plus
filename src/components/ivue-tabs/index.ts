import { App } from 'vue';
import IvueTabs from './index.vue';
import IvueTab from './tab.vue';

export default (app: App): void => {
    app.component(IvueTabs.name, IvueTabs);
    app.component(IvueTab.name, IvueTab);
};

export { IvueTabs, IvueTab };
