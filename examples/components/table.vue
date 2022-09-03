<template>
    <div>
        <h1>基础表格</h1>
        <ivue-table
            :data="tableData"
            style="width: 100%"
            resizable
            border
            :rowStyle="headerCellStyle"
            rowClassName="red"
        >
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <h1>带斑马纹表格</h1>
        <ivue-table :data="tableData" stripe style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <h1>带边框表格</h1>
        <ivue-table :data="tableData" border style="width: 100%">
            <ivue-table-column prop="date" label="Dat   e" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <h1>带状态表格</h1>
        <ivue-table
            :data="tableData"
            :rowClassName="tableRowClassName"
            :rowStyle="rowStyle"
            style="width: 100%"
        >
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <h1>固定表头</h1>
        <ivue-table :data="tableData" height="250" style="width: 100%">
            <ivue-table-column prop="date" label="Date" width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <h1>固定列</h1>
        <ivue-table border height="250" :data="tableData3" style="width: 100%">
            <ivue-table-column fixed prop="date" label="Date" width="150"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="120"></ivue-table-column>
            <ivue-table-column prop="state" label="State" width="120"></ivue-table-column>
            <ivue-table-column prop="city" label="City" width="120"></ivue-table-column>
            <ivue-table-column prop="address" label="Address" width="600"></ivue-table-column>
            <ivue-table-column fixed="right" prop="zip" label="Zip" width="120"></ivue-table-column>
            <ivue-table-column fixed="right" label="Operations" width="120">
                <template #default>12121</template>
            </ivue-table-column>
        </ivue-table>
        <h1>流体高度</h1>
        <ivue-table maxHeight="250" :data="tableData13" style="width: 100%">
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
        <ivue-button @click="onAddItem">Add</ivue-button>
        <h1>多级表头</h1>
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
        </ivue-table>

        <h1>单选</h1>
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
            <ivue-table-column prop="address" label="Address" showOverflowTooltip></ivue-table-column>
        </ivue-table>
        <ivue-button @click="setCurrent(tableData[1])">Select second row</ivue-button>
        <ivue-button @click="setCurrent()">Clear selection</ivue-button>
        <h1>多选</h1>
        <ivue-table
            ref="table"
            :data="tableData3"
            style="width: 100%"
            @on-selection-change="handleonSelectionChange"
        >
            <ivue-table-column type="selection" width="55" reserveSelection></ivue-table-column>
            <ivue-table-column prop="date" label="date" width="120"></ivue-table-column>
            <ivue-table-column prop="name" label="name" showOverflowTooltip></ivue-table-column>
        </ivue-table>
        <p>间隔</p>
        <ivue-table
            ref="table123"
            :data="tableData3"
            style="width: 100%"
            :selectOnIndeterminate="false"
            @on-selection-change="handleonSelectionChange"
        >
            <ivue-table-column type="selection" width="55"></ivue-table-column>
            <ivue-table-column prop="date" label="date" width="120"></ivue-table-column>
            <ivue-table-column prop="name" label="name" showOverflowTooltip></ivue-table-column>
        </ivue-table>

        <ivue-button @click="toggleSelection([tableData[1], tableData[2]])">Select second row</ivue-button>
        <ivue-button @click="toggleSelection()">Clear selection</ivue-button>
        <ivue-button @click="updata()">Updata</ivue-button>
        <ivue-button @click="updata1()">Updata1</ivue-button>
        <ivue-button @click="updata2()">Updata2</ivue-button>

        <h1>排序</h1>
        <ivue-table
            ref="table"
            :data="tableData4"
            style="width: 100%"
            @on-header-click="onHeaderClick"
        >
            <ivue-table-column
                prop="date"
                label="Date"
                sortable
                :sortOrders="['ascending', 'descending']"
                :sortMethod="sortMethod"
                :sortBy="['name']"
                width="180"
                align="center"
                headerAlign="center"
            ></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180" headerAlign="center"></ivue-table-column>
            <ivue-table-column prop="address" label="Address" :formatter="formatter"></ivue-table-column>
        </ivue-table>

        <h1>筛选</h1>
        <!-- filterPlacement="right" -->
        <!-- :filtered-value="['2016-05-01']" -->
        <ivue-table ref="table" :data="tableData6" style="width: 100%">
            <ivue-table-column
                prop="date"
                label="Date"
                width="180"
                sortable
                columnKey="date"
                :filters="[
                    { text: '2016-05-01', value: '2016-05-01' },
                    { text: '2016-05-02', value: '2016-05-02' },
                    { text: '2016-05-03', value: '2016-05-03' },
                    { text: '2016-05-04', value: '2016-05-04' },
                ]"
                :filterMethod="filterHandler"
                :filterMultiple="false"
            ></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column
                prop="tag"
                label="tag"
                columnKey="date"
                :filters="[
                  { text: 'Home', value: 'Home' },
                 { text: 'Office', value: 'Office' },
                ]"
                :filterMethod="filterTag"
                :filter-method="filterTag"
            ></ivue-table-column>
        </ivue-table>

        <button @click="resetDateFilter">reset date filter</button>
        <button @click="clearFilter">reset all filters</button>-->
        <h1>自定义列模板</h1>
        <ivue-table :data="tableData" style="width: 100%">
            <ivue-table-column prop="date" label="Date">
                <template #default="scope">插槽{{ scope.row }}{{ scope.$index }}</template>
            </ivue-table-column>
            <ivue-table-column prop="name" label="Name" align="right" headerAlign="center"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>

        <h1>自定义表头</h1>
        <ivue-table :data="tableData" style="width: 100%">
            <ivue-table-column prop="date" label="Date">
                <template #header>自定义表头</template>
                <template #default="scope">插槽{{ scope.row }}</template>
            </ivue-table-column>
            <ivue-table-column prop="name" label="Name" align="right" headerAlign="center"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>

        <h1>表格布局</h1>
        <ivue-table :data="tableData3" tableLayout="auto">
            <ivue-table-column
                prop="date"
                label="Date"
                sortable
                columnKey="date"
                :filters="[
                    { text: '2016-05-01', value: '2016-05-01' },
                    { text: '2016-05-02', value: '2016-05-02' },
                    { text: '2016-05-03', value: '2016-05-03' },
                    { text: '2016-05-04', value: '2016-05-04' },
                ]"
                :filterMethod="filterHandler"
            ></ivue-table-column>
            <ivue-table-column prop="name" label="Name">
                <template #header>自定义表头</template>
                <template #default="scope">插槽{{ scope.row }}</template>
            </ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <ivue-table :data="tableData3" tableLayout="fixed">
            <ivue-table-column
                prop="date"
                label="Date"
                sortable
                columnKey="date"
                :filters="[
                    { text: '2016-05-01', value: '2016-05-01' },
                    { text: '2016-05-02', value: '2016-05-02' },
                    { text: '2016-05-03', value: '2016-05-03' },
                    { text: '2016-05-04', value: '2016-05-04' },
                ]"
                :filterMethod="filterHandler"
            ></ivue-table-column>
            <ivue-table-column prop="name" label="Name">
                <template #header>自定义表头</template>
                <template #default="scope">插槽{{ scope.row }}</template>
            </ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>

        <h1>自定义索引</h1>
        <ivue-table :data="tableData3" style="width: 100%">
            <ivue-table-column type="index" :index="indexMethod"></ivue-table-column>
            <ivue-table-column prop="date" label="Date" width="180" :renderHeader="renderHeader"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" width="180"></ivue-table-column>
            <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
        <h1>展开行</h1>
        <ivue-table
            :data="tableData8"
            border
            style="width: 100%"
            rowKey="date"
            :expand-row-keys="['31']"
            row-key="id"
        >
            <ivue-table-column type="expand">
                <template #default="props">
                    <div>
                        <p>State: {{ props.row.state }}</p>
                        <p>City: {{ props.row.city }}</p>
                        <p>Address: {{ props.row.address }}</p>
                        <p>Zip: {{ props.row.zip }}</p>
                        <h3>Family</h3>
                        <ivue-table :data="props.row.family" border>
                            <ivue-table-column label="Name" prop="name"></ivue-table-column>
                            <ivue-table-column label="State" prop="state"></ivue-table-column>
                            <ivue-table-column label="City" prop="city"></ivue-table-column>
                            <ivue-table-column label="Address" prop="address"></ivue-table-column>
                            <ivue-table-column label="Zip" prop="zip"></ivue-table-column>
                        </ivue-table>
                    </div>
                </template>
            </ivue-table-column>
            <ivue-table-column label="Date" prop="date"></ivue-table-column>
            <ivue-table-column label="Name" prop="name"></ivue-table-column>
        </ivue-table>

        <ivue-table :data="tableData8" style="width: 100%" rowKey="date">
            <ivue-table-column type="expand">
                <template #default>122121122121</template>
            </ivue-table-column>
            <ivue-table-column label="Date" prop="date"></ivue-table-column>
            <ivue-table-column label="Name" prop="name"></ivue-table-column>
        </ivue-table>

        <h1>树形数据与懒加载</h1>
        <ivue-table :data="tableData9" style="width: 100%" border rowKey="id" :indent="100">
            <ivue-table-column prop="date" label="date" sortable width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" sortable width="180"></ivue-table-column>
        </ivue-table>
        <ivue-table
            :data="tableData10"
            style="width: 100%"
            border
            rowKey="id"
            lazy
            :load="load"
            :treeProps="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <ivue-table-column prop="date" label="date" sortable width="180"></ivue-table-column>
            <ivue-table-column prop="name" label="Name" sortable width="180"></ivue-table-column>
        </ivue-table>
        <h1>表尾合计行</h1>
        <ivue-table :data="tableData11" showSummary>
            <ivue-table-column prop="id" label="ID" width="180" fixed="left"></ivue-table-column>
            <ivue-table-column prop="name" label="Name"></ivue-table-column>
            <ivue-table-column prop="amount1" sortable label="Amount 1"></ivue-table-column>
            <ivue-table-column prop="amount2" sortable label="Amount 2"></ivue-table-column>
            <ivue-table-column prop="amount3" sortable label="Amount 3" fixed="right"></ivue-table-column>
        </ivue-table>
        <ivue-table
            :data="tableData11"
            showSummary
            border
            height="200"
            :summaryMethod="getSummaries"
        >
            <ivue-table-column prop="id" label="ID" width="180" fixed="left"></ivue-table-column>
            <ivue-table-column prop="name" label="Name"></ivue-table-column>
            <ivue-table-column prop="amount1" sortable label="Amount 1"></ivue-table-column>
            <ivue-table-column prop="amount2" sortable label="Amount 2"></ivue-table-column>
            <ivue-table-column prop="amount3" sortable label="Amount 3" fixed="right"></ivue-table-column>
        </ivue-table>

        <h1>合并行或列</h1>
        <ivue-table :data="tableData11" border>
            <ivue-table-column prop="id" label="ID" width="180" fixed="left"></ivue-table-column>
            <ivue-table-column prop="name" label="Name"></ivue-table-column>
            <ivue-table-column prop="amount1" sortable label="Amount 1"></ivue-table-column>
            <ivue-table-column prop="amount2" sortable label="Amount 2"></ivue-table-column>
            <ivue-table-column prop="amount3" sortable label="Amount 3" fixed="right"></ivue-table-column>
        </ivue-table>

        <ivue-table :data="tableData11" border :spanMethod="arraySpanMethod">
            <ivue-table-column prop="id" label="ID" width="180" fixed="left"></ivue-table-column>
            <ivue-table-column prop="name" label="Name"></ivue-table-column>
            <ivue-table-column prop="amount1" sortable label="Amount 1"></ivue-table-column>
            <ivue-table-column prop="amount2" sortable label="Amount 2"></ivue-table-column>
            <ivue-table-column prop="amount3" sortable label="Amount 3" fixed="right"></ivue-table-column>
        </ivue-table>

        <ivue-table :data="tableData11" border :spanMethod="objectSpanMethod">
            <ivue-table-column prop="id" label="ID" width="180" fixed="left"></ivue-table-column>
            <ivue-table-column prop="name" label="Name"></ivue-table-column>
            <ivue-table-column prop="amount1" sortable label="Amount 1"></ivue-table-column>
            <ivue-table-column prop="amount2" sortable label="Amount 2"></ivue-table-column>
            <ivue-table-column prop="amount3" sortable label="Amount 3" fixed="right"></ivue-table-column>
        </ivue-table>
    </div>
</template>

<script>
import { h } from 'vue';

export default {
    data() {
        return {
            tableData: [
                {
                    date: '2016-05-03',
                    name: '1',
                    address: 'No. 189, Grove St, Los Angeles1',
                },
            ],
            tableData2: [
                {
                    date: '2016-05-03',
                    name: '2',
                    address: 'No. 189, Grove St, Los Angeles1',
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
             tableData13: [
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
                    name: '1',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-02',
                    name: '3',
                    state: 'California',
                    city: 'Los Angeles',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: 'CA 90036',
                },
                {
                    date: '2016-05-04',
                    name: '0',
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
            tableData5: [
                {
                    date: '2016-05-03',
                    name: '3',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-02',
                    name: '4',
                    address: 'No. 189, Grove St, Los Angeles',
                },
            ],
            tableData6: [
                {
                    date: '2016-05-03',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                    tag: 'Home',
                },
                {
                    date: '2016-05-02',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                    tag: 'Office',
                },
                {
                    date: '2016-05-04',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                    tag: 'Home',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                    tag: 'Office',
                },
            ],
            tableData7: [
                {
                    date: '2016-05-03',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    date: '2016-05-02',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    date: '2016-05-04',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    date: '2016-05-08',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    date: '2016-05-06',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    date: '2016-05-07',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
            ],
            tableData8: [
                {
                    id: 31,
                    date: '2016-05-01',
                    name: 'wangxiaohu',
                },
                {
                    id: 32,
                    date: '2016-05-02',
                    name: 'wangxiaohu',
                },
            ],
            tableData9: [
                {
                    id: 1,
                    date: '2016-05-02',
                    name: 'wangxiaohu',
                },
                {
                    id: 2,
                    date: '2016-05-04',
                    name: 'wangxiaohu',
                },
                {
                    id: 3,
                    date: '2016-05-01',
                    name: 'wangxiaohu',
                    children: [
                        {
                            id: 31,
                            date: '2016-05-01',
                            name: 'wangxiaohu',
                        },
                        {
                            id: 32,
                            date: '2016-05-01',
                            name: 'wangxiaohu',
                        },
                    ],
                },
                {
                    id: 4,
                    date: '2016-05-03',
                    name: 'wangxiaohu',
                },
            ],
            tableData10: [
                {
                    id: 1,
                    date: '2016-05-02',
                    name: 'wangxiaohu',
                },
                {
                    id: 2,
                    date: '2016-05-04',
                    name: 'wangxiaohu',
                    hasChildren: true,
                },
                {
                    id: 3,
                    date: '2016-05-01',
                    name: 'wangxiaohu',
                    hasChildren: true,
                },
                {
                    id: 4,
                    date: '2016-05-03',
                    name: 'wangxiaohu',
                    children: [
                        {
                            id: 6,
                            date: '2016-05-01',
                            name: 'wangxiaohu',
                            hasChildren: true,
                        },
                        {
                            id: 7,
                            date: '2016-05-01',
                            name: 'wangxiaohu',
                        },
                    ],
                },
            ],
            tableData11: [
                {
                    id: '12987122',
                    name: 'Tom',
                    amount1: '234',
                    amount2: '3.2',
                    amount3: 10,
                },
                {
                    id: '12987123',
                    name: 'Tom',
                    amount1: '165',
                    amount2: '4.43',
                    amount3: 12,
                },
                {
                    id: '12987124',
                    name: 'Tom',
                    amount1: '324',
                    amount2: '1.9',
                    amount3: 9,
                },
                {
                    id: '12987125',
                    name: 'Tom',
                    amount1: '621',
                    amount2: '2.2',
                    amount3: 17,
                },
                {
                    id: '12987126',
                    name: 'Tom',
                    amount1: '539',
                    amount2: '4.1',
                    amount3: 15,
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
            this.tableData13.push({
                date: 1,
                name: 'Tom',
                state: 'California',
                city: 'Los Angeles',
                address: 'No. 189, Grove St, Los Angeles',
                zip: 'CA 90036',
            });
        },
        deleteRow(index) {
            this.tableData13.splice(index, 1);
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
            // setTimeout(() => {
            //     console.log(
            //         'getSelectionRows',
            //         this.$refs.table123.getSelectionRows()
            //     );
            // });

            if (rows) {
                rows.forEach((row) => {
                    this.$refs.table123.toggleRowSelection(row, undefined);
                });
            } else {
                this.$refs.table123.clearSelection();
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
        formatter(row) {
            return `测试${row.address}`;
        },
        onHeaderClick(column, event) {
            console.log('e', column.order);
        },
        updata() {
            this.tableData = [
                {
                    date: '2016-05-03',
                    name: '1',
                    address: 'No. 189, Grove St, Los Angeles1',
                },
            ];
        },
        updata1() {
            this.tableData = [
                {
                    date: '2016-05-03',
                    name: '2',
                    address: 'No. 189, Grove St, Los Angeles1',
                },
            ];
        },
        updata2() {
            this.tableData = [
                {
                    date: '2016-05-03',
                    name: '3',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-02',
                    name: '4',
                    address: 'No. 189, Grove St, Los Angeles',
                },
            ];
        },
        getRowKey(row) {
            return row.name;
        },
        sortMethod(a, b) {
            return a.date - b.date;
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        resetDateFilter() {
            this.$refs.table.clearFilter(['date']);
        },
        clearFilter() {
            this.$refs.table.clearFilter();
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        indexMethod(index) {
            return index * 2;
        },
        renderHeader() {
            console.log('renderHeader');
            return h('div', {}, 'renderHeader');
        },
        load(row, treeNode, resolve) {
            console.log('row', row);
            setTimeout(() => {
                console.log('?load??');
                resolve([
                    {
                        id: Math.random(),
                        date: '2016-05-01',
                        name: 'wangxiaohu',
                        hasChildren: true,
                    },
                    {
                        id: Math.random(),
                        date: '2016-05-01',
                        name: 'wangxiaohu',
                    },
                ]);
            }, 1000);
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];

            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = 'Total Cost';
                    return;
                }
                const values = data.map((item) =>
                    Number(item[column.property])
                );
                if (!values.every((value) => Number.isNaN(value))) {
                    sums[index] = `$ ${values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!Number.isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0)}`;
                } else {
                    sums[index] = 'N/A';
                }
            });

            return sums;
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex % 2 === 0) {
                if (columnIndex === 0) {
                    return [1, 2];
                } else if (columnIndex === 1) {
                    return [0, 0];
                }
            }
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            }
        },
        headerCellStyle() {
            return {
                color: 'red',
            };
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

.red {
    background: red;
}
</style>
