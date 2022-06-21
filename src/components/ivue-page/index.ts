import { App } from 'vue';
import IvuePage from './index.vue';

export default (app: App): void => {
    app.component(IvuePage.name, IvuePage);
};

export { IvuePage };
