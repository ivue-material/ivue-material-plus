import { App } from 'vue';
import IvueTable from './index.vue';
import IvueTableColumn from './table-column/index';

export default (app: App): void => {
    app.component(IvueTable.name, IvueTable);
    app.component(IvueTableColumn.name, IvueTableColumn);
};

export { IvueTable, IvueTableColumn };
