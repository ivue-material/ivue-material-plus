import { App } from 'vue';
import IvueCountUp from './index.vue';

export default (app: App): void => {
  app.component(IvueCountUp.name, IvueCountUp);
};

export { IvueCountUp };
