<template>
    <div>
        <p>基本用法</p>
        <button @click="handleClear">clear</button>
        <ivue-select v-model="model1" style="width:200px" transfer labelAndValue @on-change="handleChange">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model1}}
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
</style>
