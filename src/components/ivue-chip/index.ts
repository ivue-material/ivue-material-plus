
import { App } from 'vue';
import IvueChip from './index.vue';

export default (app: App): void => {
  app.component(IvueChip.name, IvueChip);
};

export { IvueChip };
