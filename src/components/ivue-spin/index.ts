import { App } from 'vue';
import IvueSpin from './index.vue';

export default (app: App): void => {
    app.component(IvueSpin.name, IvueSpin);
};

export { IvueSpin };
