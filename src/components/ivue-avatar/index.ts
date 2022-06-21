import { App } from 'vue';
import IvueAvatar from './index.vue';

export default (app: App): void => {
    app.component(IvueAvatar.name, IvueAvatar);
};

export { IvueAvatar };
