<template>
    <div>
        <h1>典型表单</h1>
        <ivue-form label-width="120px">
            <ivue-form-item label="Activity name">
                <ivue-input v-model="form.name" />
            </ivue-form-item>
            <ivue-form-item label="Activity zone">
                <ivue-select
                    v-model="form.region"
                    filterable
                    style="width:200px"
                >
                    <ivue-option
                        v-for="item in cityList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</ivue-option>
                </ivue-select>
            </ivue-form-item>
        </ivue-form>
    </div>
</template>

<script  setup>
import { reactive } from 'vue';

// do not use same name with ref
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
});

const cityList = [
    {
        value: 'New York12',
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
];

const onSubmit = () => {
    console.log('submit!');
};
</script>

<style lang="scss" scoped>
</style>
