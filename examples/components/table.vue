<template>
    <div>
        <!-- <h1>基础表格</h1>
        <ivue-table :data="tableData" style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table> -->
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
        <h1>固定列</h1>
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
        </ivue-table>
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
