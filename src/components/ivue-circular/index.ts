
import { App } from 'vue';
import IvueCircular from './circular.vue';

export default (app: App): void => {
    app.component(IvueCircular.name, IvueCircular);
};

export { IvueCircular };
