<template>
    <div>
        <h1>基础表格</h1>
        <ivue-table :data="tableData" style="width: 100%">
212
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
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
