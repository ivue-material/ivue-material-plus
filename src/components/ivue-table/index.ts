import { withInstall, withNoopInstall } from '../../utils/install';

import Table from './table.vue';
import TableColumn from './table-column/index';

export const IvueTable = withInstall(Table, {
    TableColumn,
});
export default IvueTable;

export const IvueTableColumn = withNoopInstall(TableColumn);

export * from './table.vue';
export * from './table-column/index';
