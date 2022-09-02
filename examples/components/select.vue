<template>
    <div>
        <p>基本用法</p>
        <button @click="handleClear">clear</button>
        <div class="content">
            <ivue-select
                v-model="model1"
                style="width:200px"
                transfer
                labelAndValue
                @on-change="handleChange"
            >
                <ivue-option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</ivue-option>
            </ivue-select>
        </div>
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
        {{multiple}}
        <p>多选</p>
        <ivue-select v-model="multiple" multiple style="width:200px">
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
        <ivue-select v-model="model11" style="width:200px" filterable ref="select">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select v-model="model12" style="width:200px" filterable multiple>
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model12}}
        <p>远程搜索</p>
        {{model13}}
        {{options1}}
        <ivue-select
            v-model="model13"
            filterable
            :searchMethod="remoteMethod1"
            :loading="loading1"
            style="width:200px"
            clearable
        >
            <ivue-option
                v-for="item in options1"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select
            v-model="model14"
            filterable
            multiple
            :searchMethod="remoteMethod2"
            :loading="loading2"
            style="width:200px"
        >
            <ivue-option
                v-for="item in options2"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model14}}
        {{options2}}
        <p>远程搜索默认值</p>
        {{model19}}
        {{options3}}
        <ivue-select
            v-model="model19"
            filterable
            :searchMethod="remoteMethod3"
            default-label="北京"
            :loading="loading3"
            style="width:200px"
        >
            <ivue-option
                v-for="item in options3"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select
            style="width:200px"
            v-model="model20"
            multiple
            filterable
            :searchMethod="remoteMethod4"
            :default-label="['北京', '深圳']"
            :loading="loading4"
            @on-set-default-options="setDefaultOptions"
        >
            <ivue-option
                v-for="item in options4"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model20}}
        {{options4}}
        <p>创建条目</p>
        <ivue-select
            style="width:200px"
            filterable
            v-model="model17"
            allow-create
            clearable
            @on-create="handleCreate1"
        >
            <ivue-option
                v-for="item in cityList3"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        <ivue-select
            style="width:200px"
            filterable
            v-model="model18"
            allow-create
            multiple
            @on-create="handleCreate2"
        >
            <ivue-option
                v-for="item in cityList4"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        {{cityList4}}
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

            model13: '',
            loading1: false,
            options1: [],
            model14: [],
            loading2: false,
            options2: [],
            multiple: [],
            list: [
                'Alabama',
                'Alaska',
                'Arizona',
                'Arkansas',
                'California',
                'Colorado',
                'Connecticut',
                'Delaware',
                'Florida',
                'Georgia',
                'Hawaii',
                'Idaho',
                'Illinois',
                'Indiana',
                'Iowa',
                'Kansas',
                'Kentucky',
                'Louisiana',
                'Maine',
                'Maryland',
                'Massachusetts',
                'Michigan',
                'Minnesota',
                'Mississippi',
                'Missouri',
                'Montana',
                'Nebraska',
                'Nevada',
                'New hampshire',
                'New jersey',
                'New mexico',
                'New york',
                'North carolina',
                'North dakota',
                'Ohio',
                'Oklahoma',
                'Oregon',
                'Pennsylvania',
                'Rhode island',
                'South carolina',
                'South dakota',
                'Tennessee',
                'Texas',
                'Utah',
                'Vermont',
                'Virginia',
                'Washington',
                'West virginia',
                'Wisconsin',
                'Wyoming',
            ],
            model19: 'beijing',
            options3: [],
            loading3: false,
            model20: ['beijing', 'shenzhen'],
            options4: [],
            loading4: false,
            list2: [
                {
                    value: 'beijing',
                    label: '北京',
                },
                {
                    value: 'shanghai',
                    label: '上海',
                },
                {
                    value: 'shenzhen',
                    label: '深圳',
                },
                {
                    value: 'hangzhou',
                    label: '杭州',
                },
                {
                    value: 'guangzhou',
                    label: '广州',
                },
            ],
            cityList3: [
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
            cityList4: [
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
            model17: '',
            model18: [],
        };
    },
    methods: {
        handleChange(value) {
            console.log(value);
        },
        handleClear() {
            this.$refs.select.handleClearSingleSelect();

            console.log(this.$refs.select.clearFlterQuery);
        },
        maxTagPlaceholder(num) {
            return 'more ' + num;
        },
        remoteMethod1(query) {
            console.log('query');
            console.log(query);
            if (query !== '') {
                this.loading1 = true;

                const list = this.list.map((item) => {
                    return {
                        value: item,
                        label: item,
                    };
                });
                this.options1 = list.filter(
                    (item) =>
                        item.label.toLowerCase().indexOf(query.toLowerCase()) >
                        -1
                );

                setTimeout(() => {
                    this.loading1 = false;
                }, 2000);
            } else {
                this.options1 = [];
            }
        },
        remoteMethod2(query) {
            if (query !== '') {
                this.loading2 = true;
                setTimeout(() => {
                    this.loading2 = false;
                    const list = this.list.map((item) => {
                        return {
                            value: item,
                            label: item,
                        };
                    });
                    this.options2 = list.filter(
                        (item) =>
                            item.label
                                .toLowerCase()
                                .indexOf(query.toLowerCase()) > -1
                    );
                }, 200);
            } else {
                this.options2 = [];
            }
        },
        remoteMethod3(query) {
            if (query !== '') {
                this.loading3 = true;
                setTimeout(() => {
                    this.loading3 = false;
                    this.options3 = this.list2.filter(
                        (item) => item.label.indexOf(query) > -1
                    );
                }, 200);
            } else {
                this.options3 = [];
            }
        },
        remoteMethod4(query) {
            if (query !== '') {
                this.loading4 = true;
                setTimeout(() => {
                    this.loading4 = false;
                    this.options4 = this.list2.filter(
                        (item) => item.label.indexOf(query) > -1
                    );
                }, 200);
            } else {
                this.options4 = [];
            }
        },
        setDefaultOptions(options) {
            this.options4 = options;
        },
        handleCreate1(val) {
            console.log('???');
            this.cityList3.push({
                value: val,
                label: val,
            });
        },
        handleCreate2(val) {
            this.cityList4.push({
                value: val,
                label: val,
            });
        },
    },
};
</script>

<style lang="scss" scoped>

.content{
    position: relative;
    height: 100px;
    overflow: hidden;
}
</style>
