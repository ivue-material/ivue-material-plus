<template>
    <div>
        <h1>典型表单</h1>
        <ivue-form label-width="auto" label-position="left">
            <ivue-form-item label="Activity nameActivity nameActivity nameActivity name">
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
                <ivue-switch v-model="form.delivery" size="large"></ivue-switch>
            </ivue-form-item>
            <ivue-form-item label="Activity type">
                <ivue-checkbox-group v-model="form.type">
                    <ivue-checkbox label="1"></ivue-checkbox>
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
        <ivue-button @click="active = !active">activeactive</ivue-button>
        <ivue-form
            label-width="120px"
            :model="form"
            :rules="active ? rules : rules1"
            require-asterisk-position="right"
            ref="ruleFormRef"
            @on-validate="handleValidate"
        >
            <ivue-form-item label="Activity name" >
                <ivue-input v-model="form.name" />
            </ivue-form-item>

            <ivue-form-item label="Activity name" prop="name" :required="false" error="121212">
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

            <ivue-form-item label="Activity type" prop="radiogroup">
                <ivue-radio-group v-model="form.radiogroup">
                    <ivue-radio label="apple"></ivue-radio>
                    <ivue-radio label="android"></ivue-radio>
                </ivue-radio-group>
            </ivue-form-item>

            <ivue-form-item label="Activity type" prop="radio">
                <ivue-radio v-model="form.radio">Radio1</ivue-radio>
            </ivue-form-item>

            <ivue-form-item
                label="age"
                prop="age"
                :rules="[
                        { required: true, message: 'age is required' },
                        { type: 'number', message: 'age must be a number' },
                    ]"
            >
                {{form.age}}
                <ivue-input v-model.number="form.age" type="text" autocomplete="off" />
            </ivue-form-item>

            <ivue-form-item>
                <ivue-button type="primary" @click="submitForm(ruleFormRef)">Create</ivue-button>
                <ivue-button @click="resetForm(ruleFormRef)">Cancel</ivue-button>
            </ivue-form-item>
        </ivue-form>
        <h1>添加/删除表单项</h1>
        <ivue-form :model="dynamicValidateForm" ref="formRef">
            <ivue-form-item
                prop="email"
                label="Email"
                :rules="[
                    {
                    required: true,
                    message: 'Please input email address',
                    trigger: 'blur',
                    },
                    {
                    type: 'email',
                    message: 'Please input correct email address',
                    trigger: ['blur', 'change'],
                    },
                ]"
            >
                <ivue-input v-model="dynamicValidateForm.email" />
            </ivue-form-item>
            <ivue-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.key"
                :label="'Domain' + index"
                :prop="'domains.' + index + '.value'"
                :rules="{
                    required: true,
                    message: 'domain can not be null',
                    trigger: 'blur',
                }"
            >
                <ivue-input v-model="domain.value" />
                <ivue-button @click="removeDomain(domain)">Delete</ivue-button>
            </ivue-form-item>
            <ivue-form-item>
                <ivue-button @click="submitForm1(formRef)">Submit</ivue-button>
                <ivue-button @click="addDomain">New domain</ivue-button>
                <ivue-button @click="resetForm1(formRef)">Reset</ivue-button>
            </ivue-form-item>
        </ivue-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const form = reactive({
    name: '2',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
    checkbox: false,
    radiogroup: '',
    radio: false,
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
            message: 'message',
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
            type: 'boolean',
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Error'));
                }
                callback();
            },
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
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Error'));
                }
                callback();
            },
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
    radiogroup: [
        {
            required: true,
            message: 'radio',
            trigger: 'change',
        },
    ],
    radio: [
        {
            type: 'boolean',
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Error'));
                }
                callback();
            },
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
};

const rules1 = {
    name: [
        {
            required: true,
            message: 'rules1message',
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
            type: 'boolean',
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Error'));
                }
                callback();
            },
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
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Error'));
                }
                callback();
            },
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
    radiogroup: [
        {
            required: true,
            message: 'radio',
            trigger: 'change',
        },
    ],
    radio: [
        {
            type: 'boolean',
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Error'));
                }
                callback();
            },
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
};

const active = ref(false);

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

const formRef = ref();
const dynamicValidateForm = reactive({
    domains: [
        {
            key: 1,
            value: '',
        },
    ],
    email: '',
});

const removeDomain = (item) => {
    const index = dynamicValidateForm.domains.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.domains.splice(index, 1);
    }
};

const addDomain = () => {
    dynamicValidateForm.domains.push({
        key: Date.now(),
        value: '',
    });
};

const submitForm1 = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!');
        } else {
            console.log('error!');
            return false;
        }
    });
};

const resetForm1 = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
};

const handleValidate = (data, isValid, message) => {
    console.log('handleValidate', data, isValid, message);
};
</script>

<style lang="scss" scoped>
</style>
