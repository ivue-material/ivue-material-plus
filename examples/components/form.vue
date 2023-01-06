<template>
    <div>
        <h1>典型表单</h1>
        <ivue-form label-width="120px">
            <ivue-form-item label="Activity name">
                <ivue-input v-model="form.name" />
            </ivue-form-item>
            <ivue-form-item label="Activity zone">
                <ivue-select v-model="form.region" style="width:200px">
                    <ivue-option
                        v-for="item in cityList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</ivue-option>
                </ivue-select>
            </ivue-form-item>
            <ivue-form-item label="Instant delivery">
                <ivue-switch v-model="form.delivery"></ivue-switch>
            </ivue-form-item>
            <ivue-form-item label="Activity type">
                <ivue-checkbox-group v-model="form.type">
                    <ivue-checkbox label="Online activities"></ivue-checkbox>
                    <ivue-checkbox label="Promotion activities"></ivue-checkbox>
                    <ivue-checkbox label="Offline activities"></ivue-checkbox>
                    <ivue-checkbox label="Simple brand exposure"></ivue-checkbox>
                </ivue-checkbox-group>
            </ivue-form-item>
            <ivue-form-item label="Resources">
                <ivue-radio-group v-model="form.resource">
                    <ivue-radio label="Sponsor" />
                    <ivue-radio label="Venue" />
                </ivue-radio-group>
            </ivue-form-item>
            <ivue-form-item label="Activity form">
                <ivue-input v-model="form.desc" type="textarea" />
            </ivue-form-item>
            <ivue-form-item>
                <ivue-button type="primary" @click="onSubmit">Create</ivue-button>
                <ivue-button>Cancel</ivue-button>
            </ivue-form-item>
        </ivue-form>
        <h1>行内表单</h1>
        <ivue-form :inline="true" :model="formInline" class="demo-form-inline">
            <ivue-form-item label="Approved by">
                <ivue-input v-model="formInline.user" placeholder="Approved by" />
            </ivue-form-item>
            <ivue-form-item label="Approved by">
                <ivue-input v-model="formInline.user" placeholder="Approved by" />
            </ivue-form-item>
            <ivue-form-item label="Activity zone">
                <ivue-select v-model="formInline.region" placeholder="Activity zone">
                    <ivue-option label="Zone one" value="shanghai" />
                    <ivue-option label="Zone two" value="beijing" />
                </ivue-select>
            </ivue-form-item>
            <ivue-form-item>
                <ivue-button type="primary" @click="onSubmit">Query</ivue-button>
            </ivue-form-item>
        </ivue-form>
        <h1>对齐方式</h1>
        <ivue-form
            label-position="top"
            label-width="100px"
            :model="formLabelAlign"
            style="max-width: 460px"
        >
            <ivue-form-item label="Name">
                <ivue-input v-model="formLabelAlign.name" />
            </ivue-form-item>
            <ivue-form-item label="Activity zone">
                <ivue-input v-model="formLabelAlign.region" />
            </ivue-form-item>
            <ivue-form-item label="Activity form">
                <ivue-input v-model="formLabelAlign.type" />
            </ivue-form-item>
        </ivue-form>
        <ivue-form
            label-position="left"
            label-width="100px"
            :model="formLabelAlign"
            style="max-width: 460px"
        >
            <ivue-form-item label="Name">
                <ivue-input v-model="formLabelAlign.name" />
            </ivue-form-item>
            <ivue-form-item label="Activity zone">
                <ivue-input v-model="formLabelAlign.region" />
            </ivue-form-item>
            <ivue-form-item label="Activity form">
                <ivue-input v-model="formLabelAlign.type" />
            </ivue-form-item>
        </ivue-form>
        <ivue-form
            label-position="right"
            label-width="100px"
            :model="formLabelAlign"
            style="max-width: 460px"
        >
            <ivue-form-item label="Name">
                <ivue-input v-model="formLabelAlign.name" />
            </ivue-form-item>
            <ivue-form-item label="Activity zone">
                <ivue-input v-model="formLabelAlign.region" />
            </ivue-form-item>
            <ivue-form-item label="Activity form">
                <ivue-input v-model="formLabelAlign.type" />
            </ivue-form-item>
        </ivue-form>

        <h1>表单校验</h1>
        <ivue-form label-width="120px" :model="form" :rules="rules" ref="ruleFormRef">
            <ivue-form-item label="Activity name" required>
                <ivue-input v-model="form.name" />
            </ivue-form-item>

            <ivue-form-item label="Activity name" prop="name">
                <ivue-input v-model="form.name" />
            </ivue-form-item>

            <ivue-form-item label="Activity zone" prop="region">
                <ivue-select v-model="form.region" clearable>
                    <ivue-option
                        v-for="item in cityList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</ivue-option>
                </ivue-select>
            </ivue-form-item>

            <ivue-form-item label="Activity zone" prop="delivery">
                <ivue-switch v-model="form.delivery"></ivue-switch>
            </ivue-form-item>

            <ivue-form-item label="Activity type" prop="type">
                <ivue-checkbox-group v-model="form.type">
                    <ivue-checkbox label="Online activities"></ivue-checkbox>
                    <ivue-checkbox label="Promotion activities"></ivue-checkbox>
                    <ivue-checkbox label="Offline activities"></ivue-checkbox>
                    <ivue-checkbox label="Simple brand exposure"></ivue-checkbox>
                </ivue-checkbox-group>
            </ivue-form-item>

            <ivue-form-item label="Activity type" prop="checkbox">
                <ivue-checkbox label="Online activities" v-model="form.checkbox"></ivue-checkbox>
            </ivue-form-item>

            <ivue-form-item>
                <ivue-button type="primary" @click="submitForm(ruleFormRef)">Create</ivue-button>
                <ivue-button @click="resetForm(ruleFormRef)">Cancel</ivue-button>
            </ivue-form-item>
        </ivue-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
    checkbox: false,
});

const formInline = reactive({
    user: '',
    region: '',
});

const formLabelAlign = reactive({
    name: '',
    region: '',
    type: '',
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

const rules = {
    name: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'change',
        },
        {
            min: 3,
            max: 5,
            message: 'Length should be 3 to 5',
            trigger: 'change',
        },
    ],
    region: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
        },
    ],
    delivery: [
        {
            required: true,
            message: 'delivery',
            type: 'boolean',
        },
    ],
    type: [
        {
            type: 'array',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
    checkbox: [
        {
            type: 'boolean',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
};

const onSubmit = () => {
    console.log('submit!');
};

const ruleFormRef = ref();
const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!');
        } else {
            console.log('error submit!', fields);
        }
    });
};

const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<style lang="scss" scoped>
</style>
