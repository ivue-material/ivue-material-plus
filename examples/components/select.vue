<template>
    <div>
        <!-- <ivue-select
            v-model="model1"
            @on-change="handleOpen"
            style="width:200px"
            filterable
            multiple
            filterableHiddenGroup
        >
            <ivue-option-group label="1">
                <ivue-option
                    v-for="item in cityList1"
                    :value="item.value"
                    :key="item.value"
                    :disabled="item.disabled"
                >{{ item.label }}</ivue-option>
            </ivue-option-group>
            <ivue-option-group label="2">
                <ivue-option
                    v-for="item in cityList2"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</ivue-option>
            </ivue-option-group>
        </ivue-select> -->
        <!-- {{model1}} -->
        {{options1}}
        <ivue-select
            v-model="model2"
            @on-change="handleOpen"
            style="width:200px"
            filterable
            clearable
            :searchMethod="remoteMethod1"
            :loading="loading1"
        >
            <ivue-option
                v-for="item in options1"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model2}}
        <!-- <p>预览图标</p>
        <div>
            <ivue-select
                @on-change="handleOpen"
                style="width:200px"
                clearable
                multiple
                v-model="model1"
                prefix="flutter_dash"
            >
                <ivue-option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</ivue-option>
            </ivue-select>

            <ivue-select v-model="model1" @on-change="handleOpen" style="width:200px" clearable>
                <template #prefix>
                    <ivue-icon>flutter_dash</ivue-icon>
                </template>
                <ivue-option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</ivue-option>
            </ivue-select>
        </div>
        <p>标签集合</p>
        <div>
            <ivue-select
                v-model="model1"
                @on-change="handleOpen"
                style="width:200px"
                multiple
                :max-tag-count="2"
            >
                <ivue-option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</ivue-option>
            </ivue-select>

            <ivue-select
                v-model="model1"
                @on-change="handleOpen"
                style="width:200px"
                multiple
                :max-tag-count="2"
                :max-tag-placeholder="maxTagPlaceholder"
            >
                <ivue-option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                    :disabled="item.disabled"
                >{{ item.label }}</ivue-option>
            </ivue-select>
        </div>-->
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
                    disabled: true,
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
                    disabled: true,
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
                    value: '1',
                    label: '1',
                },
                {
                    value: '2',
                    label: '2',
                },
                {
                    value: '3',
                    label: '3',
                },
                {
                    value: '4',
                    label: '4',
                },
                {
                    value: '5',
                    label: '5',
                },
            ],
            model1: ['London'],
            model2: '',
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
            loading1: false,
            options1: [],
        };
    },
    methods: {
        handleOpen(data) {
            console.log(data);
        },
        maxTagPlaceholder(num) {
            return 'more ' + num;
        },
        remoteMethod1(query) {
            console.log('query')
            console.log(query)
            if (query !== '') {
                this.loading1 = true;
                setTimeout(() => {
                    this.loading1 = false;

                    const list = this.list.map((item) => {
                        return {
                            value: item,
                            label: item,
                        };
                    });


                    this.options1 = list.filter(
                        (item) =>
                            item.label
                                .toLowerCase()
                                .indexOf(query.toLowerCase()) > -1
                    );

                    console.log(this.options1)
                }, 2000);
            } else {
                this.options1 = [];
            }
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
