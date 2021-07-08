<template>
    <div>
        <p>基本用法</p>
        <ivue-select v-model="model1" style="width:200px">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model1}}
        <p>禁用</p>
        <ivue-select v-model="model1" disabled style="width:200px">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select v-model="model6" style="width:200px">
            <ivue-option value="1">New York</ivue-option>
            <ivue-option value="2" disabled>London</ivue-option>
            <ivue-option value="3">Sydney</ivue-option>
        </ivue-select>
        <p>可清空</p>
        <ivue-select v-model="model8" style="width:200px" clearable>
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <p>分组</p>
        <ivue-select v-model="model7" style="width:200px">
            <ivue-option-group label="Hot Cities">
                <ivue-option
                    v-for="item in cityList1"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</ivue-option>
            </ivue-option-group>

            <ivue-option-group label="Other Cities">
                <ivue-option
                    v-for="item in cityList2"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</ivue-option>
            </ivue-option-group>
        </ivue-select>
        {{model7}}
        <p>自定义模板</p>

        <ivue-select v-model="model9" style="width:200px" clearable>
            <ivue-option value="New York" label="New York">
                <span>New York</span>
                <span style="float:right;color:#ccc">America</span>
            </ivue-option>
            <ivue-option value="London" label="London">
                <span>London</span>
                <span style="float:right;color:#ccc">U.K.</span>
            </ivue-option>
            <ivue-option value="Sydney" label="Sydney">
                <span>Sydney</span>
                <span style="float:right;color:#ccc">Australian</span>
            </ivue-option>
        </ivue-select>
        {{model9}}
        <p>多选</p>
        <ivue-select v-model="model10" multiple style="width:200px">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model10}}
        <p>prefix</p>

        <ivue-select v-model="model10" prefix="catching_pokemon" style="width:200px">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select v-model="model10" style="width:200px">
            <template #prefix>
                <ivue-icon>cruelty_free</ivue-icon>
            </template>
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <p>标签集合</p>
        <ivue-select v-model="model16" multiple :max-tag-count="2" style="width:200px">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select
            v-model="model16"
            multiple
            :max-tag-count="2"
            :max-tag-placeholder="maxTagPlaceholder"
            style="width:200px"
        >
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model16}}
        <p>可搜索</p>
        <ivue-select v-model="model11" style="width:200px" filterable>
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select v-model="model11" style="width:200px" filterable multiple>
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cityList: [
                {
                    value: 'New York',
                    label: 'New York',
                },
                {
                    value: 'London',
                    label: 'London',
                },
                {
                    value: 'Sydney',
                    label: 'Sydney',
                },
                {
                    value: 'Ottawa',
                    label: 'Ottawa',
                },
                {
                    value: 'Paris',
                    label: 'Paris',
                },
                {
                    value: 'Canberra',
                    label: 'Canberra',
                },
            ],
            cityList1: [
                {
                    value: 'New York',
                    label: 'New York',
                },
                {
                    value: 'London',
                    label: 'London',
                },
                {
                    value: 'Sydney',
                    label: 'Sydney',
                },
            ],
            cityList2: [
                {
                    value: 'Ottawa',
                    label: 'Ottawa',
                },
                {
                    value: 'Paris',
                    label: 'Paris',
                },
                {
                    value: 'Canberra',
                    label: 'Canberra',
                },
                {
                    value: 'Ottawa1',
                    label: 'Ottawa1',
                },
                {
                    value: 'Paris1',
                    label: 'Paris1',
                },
                {
                    value: 'Canberra1',
                    label: 'Canberra1',
                },
            ],
            model1: '',
            model6: '',
            model8: '',
            model7: '',
            model9: '',
            model10: '',
            model11: '',
            model12: [],
            model16: [],
        };
    },
    methods: {
        maxTagPlaceholder(num) {
            return 'more ' + num;
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
