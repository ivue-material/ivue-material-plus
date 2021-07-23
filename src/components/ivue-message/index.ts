import { App } from 'vue';
import Message from './message';

export default (app: App): void => {
    app.config.globalProperties.$message = Message;
};

export { Message };
