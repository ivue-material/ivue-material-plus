
import { App } from 'vue';
import IvueProgressLinear from './linear.vue';

export default (app: App): void => {
    app.component(IvueProgressLinear.name, IvueProgressLinear);
};

export { IvueProgressLinear };
