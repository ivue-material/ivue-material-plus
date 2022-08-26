import { App } from 'vue';
import IvueCountDown from './index.vue';

export default (app: App): void => {
  app.component(IvueCountDown.name, IvueCountDown);
};

export { IvueCountDown };
