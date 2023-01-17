<template>
    <ivue-form :model="formItem" :rules="rulesList" :label-width="120" ref="formRef" disabled>
        <ivue-form-item label="Input" prop="input" ref="formItemRef">
            <ivue-input v-model="formItem.input"></ivue-input>
        </ivue-form-item>

        <ivue-form-item label="Textarea" prop="textarea" showSuccessStatus>
            <ivue-input v-model="formItem.textarea" type="textarea"></ivue-input>
        </ivue-form-item>

        <ivue-form-item label="Auto Complete" prop="autoComplete">
            <ivue-auto-complete
                v-model="formItem.autoComplete"
                :list="autoCompleteList"
                @on-search="handleSearch"
            ></ivue-auto-complete>
        </ivue-form-item>

        <ivue-form-item label="Input Number" prop="inputNumber">
            <ivue-input-number v-model="formItem.inputNumber" controlsOutside></ivue-input-number>
        </ivue-form-item>

        <ivue-form-item label="Select" prop="select">
            <ivue-select v-model="formItem.select">
                <ivue-option value="多啦a梦">多啦a梦</ivue-option>
                <ivue-option value="野比大雄">野比大雄</ivue-option>
                <ivue-option value="源静香">源静香</ivue-option>
            </ivue-select>
        </ivue-form-item>

        <ivue-form-item label="Checkbox" prop="checkbox">
            <ivue-checkbox-group v-model="formItem.checkbox">
                <ivue-checkbox label="多啦a梦"></ivue-checkbox>
                <ivue-checkbox label="野比大雄"></ivue-checkbox>
                <ivue-checkbox label="源静香"></ivue-checkbox>
            </ivue-checkbox-group>
        </ivue-form-item>

        <ivue-form-item label="radio" prop="radio">
            <ivue-radio-group v-model="formItem.radio">
                <ivue-radio label="多啦a梦"></ivue-radio>
                <ivue-radio label="野比大雄"></ivue-radio>
                <ivue-radio label="源静香"></ivue-radio>
            </ivue-radio-group>
        </ivue-form-item>

        <ivue-form-item>
            <ivue-button class="form-demo-button" status="primary" @click="handleSubmit">Submit</ivue-button>
            <ivue-button class="form-demo-button" @click="handleReset">Reset</ivue-button>
        </ivue-form-item>
    </ivue-form>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue';

const { proxy } = getCurrentInstance();

const formRef = ref();
const formItemRef = ref();

const autoCompleteList = ref();

const formItem = ref({
    input: '',
    inputNumber: 0,
    textarea: '',
    select: '',
    checkbox: [],
    radio: '',
    autoComplete: '',
});

const rulesList = {
    input: [
        {
            required: true,
            message: '请输入input内容',
            trigger: 'change',
        },
        // {
        //     min: 3,
        //     max: 5,
        //     message: '输入范围 3 到 5',
        //     trigger: 'change',
        // },
    ],
    textarea: [
        {
            required: true,
            message: '请输入textarea内容',
            trigger: 'blur',
        },
    ],
    inputNumber: [
        {
            required: true,
            message: '请输入数量',
            trigger: 'change',
            type: 'number',
        },
    ],
    select: [
        {
            required: true,
            message: '请选择下拉框',
            trigger: 'change',
        },
    ],
    checkbox: [
        {
            type: 'array',
            required: true,
            message: '请选择多选',
            trigger: 'change',
        },
    ],
    radio: [
        {
            required: true,
            message: '请选择单选',
            trigger: 'change',
        },
    ],
    autoComplete: [
        {
            required: true,
            message: '请选择单选',
            trigger: 'change',
        },
    ],
};

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        console.log('valid', valid);
        if (valid) {
            proxy.$message.success('Success!');
        } else {
            proxy.$message.error('Fail!');
        }
    });
};

const handleReset = () => {
    formRef.value.resetFields();
};

const handleSearch = (value) => {
    autoCompleteList.value = !value
        ? []
        : [value, value + value, value + value + value];
};

onMounted(() => {
});
</script>

<style scoped>
.form-demo-button {
    margin-right: 20px;
}
</style>
