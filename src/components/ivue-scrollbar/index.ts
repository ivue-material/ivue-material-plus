import { App } from 'vue';

import IvueScrollbar from './index.vue';

export default (app: App): void => {
  app.component(IvueScrollbar.name, IvueScrollbar);

};

export { IvueScrollbar };
