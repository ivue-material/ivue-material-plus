import { App } from 'vue';
import IvueCollapse from './collapse.vue';
import IvueCollapsePanel from './panel.vue';

export default (app: App): void => {
  app.component(IvueCollapse.name, IvueCollapse);
  app.component(IvueCollapsePanel.name, IvueCollapsePanel);
};

export { IvueCollapse, IvueCollapsePanel };
