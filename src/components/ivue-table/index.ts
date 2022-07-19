import { App } from 'vue';
import IvueTable from './index.vue';

export default (app: App): void => {
    app.component(IvueTable.name, IvueTable);
};

export { IvueTable };
