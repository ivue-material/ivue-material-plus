import { App } from 'vue';
import IvueTabs from './index.vue';
import IvueTab from './tab.vue';
import IvueTabItem from './item.vue';

export default (app: App): void => {
    app.component(IvueTabs.name, IvueTabs);
    app.component(IvueTab.name, IvueTab);
    app.component(IvueTabItem.name, IvueTabItem);
};

export { IvueTabs, IvueTab, IvueTabItem };
