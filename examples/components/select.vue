<template>
    <div>
        <!-- {{model1}}
         <ivue-select
            v-model="model1"
            @on-change="handleOpen"
            style="width:200px"
            filterable
            clearable
            multiple
            :searchMethod="remoteMethod2"
            :loading="loading2"
        >
            <ivue-option
                v-for="item in options2"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"
            >{{ item.label }}</ivue-option>
        </ivue-select>-->
        <!-- {{model1}} -->
        <!-- {{options1}} -->
        <ivue-select
            v-model="model19"
            filterable
            style="width:200px"
            :searchMethod="remoteMethod3"
            default-label="北京"
            :loading="loading3"
            clearable
        >
            <ivue-option
                v-for="item in options3"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"
            >{{ item.label }}</ivue-option>
        </ivue-select>

        {{model19}}
        <ivue-select
            v-model="model20"
            multiple
            filterable
            style="width:200px"
            :searchMethod="remoteMethod4"
            :default-label="['北京', '深圳']"
            :loading="loading4"
            @on-set-default-options="setDefaultOptions"
        >
            <ivue-option
                v-for="item in options4"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model20}}
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
        };
    },
    methods: {
        remoteMethod3(query) {
            console.log(query);
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
            console.log(options);
            this.options4 = options;
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
