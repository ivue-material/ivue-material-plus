<template>
    <div>
        <!-- <h1>基础表格</h1>
        <ivue-table :data="tableData" style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="180" align="center"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180" align="right"  header-align="center"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>-->
        <!-- <h1>带斑马纹表格</h1>
        <ivue-table :data="tableData" stripe style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>-->
        <!-- <h1>带边框表格</h1>
        <ivue-table :data="tableData" border style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>-->
        <!-- <h1>带状态表格</h1>
        <ivue-table
            :data="tableData"
            :rowClassName="tableRowClassName"
            :rowStyle="rowStyle"
            style="width: 100%"
        >
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>-->
        <!-- <h1>固定表头</h1>
        <ivue-table :data="tableData" height="250" style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>-->
        <!-- <h1>固定列</h1>
        <ivue-table border  height="250" :data="tableData2" style="width: 100%">
            <ivue-table-column fixed prop="date" label="Date" width="150"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="120"></ivue-table-column>
            <ivue-table-column prop="state" label="State" width="120"></ivue-table-column>
            <ivue-table-column prop="city" label="City" width="120"></ivue-table-column>
            <ivue-table-column prop="address" label="Address" width="600"></ivue-table-column>
            <ivue-table-column fixed="right" prop="zip" label="Zip" width="120"></ivue-table-column>
            <ivue-table-column fixed="right" label="Operations" width="120">
                <template #default>
                 12121
                </template>
            </ivue-table-column>
        </ivue-table>-->
        <!-- <h1>流体高度</h1>
        <ivue-table maxHeight="250" :data="tableData3" style="width: 100%">
            <ivue-table-column fixed prop="date" label="Date" width="150"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="120"></ivue-table-column>
            <ivue-table-column prop="state" label="State" width="120"></ivue-table-column>
            <ivue-table-column prop="city" label="City" width="120"></ivue-table-column>
            <ivue-table-column prop="address" label="Address" width="600"></ivue-table-column>
            <ivue-table-column fixed="right" prop="zip" label="Zip" width="120"></ivue-table-column>
            <ivue-table-column fixed="right" label="Operations" width="120">
                <template #default="scope">
                    <ivue-button @click="deleteRow(scope.$index)">delete</ivue-button>
                </template>
            </ivue-table-column>
        </ivue-table>
        <ivue-button @click="onAddItem">Add</ivue-button>-->
        <!-- <h1>多级表头</h1>
        <ivue-table :data="tableData4" style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="150"></ivue-table-column>
            <ivue-table-column label="Delivery Info">
                <ivue-table-column prop="name" label="Name" width="120" />
                <ivue-table-column label="Address Info">
                    <ivue-table-column prop="state" label="State" width="120" />
                    <ivue-table-column prop="city" label="City" width="120" />
                    <ivue-table-column prop="address" label="Address" />
                    <ivue-table-column prop="zip" label="Zip" width="120" />
                </ivue-table-column>
            </ivue-table-column>
        </ivue-table>-->
        <!-- <h1>单选</h1>
        <ivue-table
            ref="singleTableRef"
            highlight-current-row
            :data="tableData"
            style="width: 100%"
            @on-current-change="handleCurrentChange"
        >
            <ivue-table-column type="index" width="50"></ivue-table-column>
            <ivue-table-column prop="date" label="Date" minWidth="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <ivue-button @click="setCurrent(tableData[1])">Select second row</ivue-button>
        <ivue-button @click="setCurrent()">Clear selection</ivue-button>-->
        <h1>多选</h1>
        <ivue-table
            ref="table"
            :data="tableData"
            style="width: 100%"
            @on-selection-change="handleonSelectionChange"
        >
            <ivue-table-column type="selection" :selectable="selectable"></ivue-table-column>
            <ivue-table-column prop="date" label="date"></ivue-table-column>
            <ivue-table-column prop="address" label="Address" showOverflowTooltip></ivue-table-column>
        </ivue-table>

        <ivue-button @click="toggleSelection([tableData[1], tableData[2]])">Select second row</ivue-button>
        <ivue-button @click="toggleSelection()">Clear selection</ivue-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [
                {
                    date: '2016-05-03',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-02',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-04',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-08',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-06',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-07',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
            ],
            tableData2: [
                {
                    date: '2016-05-03',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                    tag: 'Home',
                },
                {
                    date: '2016-05-02',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                    tag: 'Office',
                },
                {
                    date: '2016-05-04',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                    tag: 'Home',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                    tag: 'Office',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                    tag: 'Office',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                    tag: 'Office',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                    tag: 'Office',
                },
            ],
            tableData3: [
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-02',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-03',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
            ],
            tableData4: [
                {
                    date: '2016-05-03',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-02',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-04',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-08',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-06',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-07',
                    name: 'Tom',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
            ],
        };
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        rowStyle({ row, rowIndex }) {
            if (rowIndex === 0) {
                return {
                    background: 'red',
                };
            }
        },
        onAddItem() {
            this.tableData3.push({
                date: 1,
                name: 'Tom',
                state: 'California',
                city: 'Los Angeles',
                address: 'No. 189, Grove St, Los Angeles',
                zip: 'CA 90036',
            });
        },
        deleteRow(index) {
            this.tableData3.splice(index, 1);
        },
        handleCurrentChange(currentRow, oldCurrentRow) {
            console.log('val', currentRow, oldCurrentRow);
        },
        setCurrent(row) {
            this.$refs.singleTableRef.setCurrentRow(row);
        },
        handleonSelectionChange(value) {
            console.log('handleonSelectionChange', value);
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach((row) => {
                    this.$refs.table.toggleRowSelection(row, undefined);
                });
            } else {
                this.$refs.table.clearSelection();
            }
        },
        selectable(row, index) {
            if (index === 2) {
                return true;
            }

            if (index === 3) {
                return true;
            }


            return false;
        },
    },
};
</script>

<style lang="scss" >
.warning-row {
    background-color: #fdf6ec;
}
.success-row {
    background-color: #f0f9eb;
}
</style>
