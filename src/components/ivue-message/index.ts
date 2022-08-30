import { App } from 'vue';
import IvueMessage from './message';

export default (app: App): void => {
    app.config.globalProperties.$message = IvueMessage;
};

export { IvueMessage };
