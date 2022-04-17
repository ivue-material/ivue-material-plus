import { App } from 'vue';
import IvueCascader from './index.vue';

export default (app: App): void => {
  app.component(IvueCascader.name, IvueCascader);
};

export { IvueCascader };
