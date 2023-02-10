<template>
  <ivue-form
    :model="formItem"
    :rules="rulesList"
    :label-width="120"
    ref="formRef"
    disabled
  >
    <ivue-form-item label="Input" prop="input" ref="formItemRef">
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

onMounted(() => {});
</script>

<style scoped>
.form-demo-button {
  margin-right: 20px;
}
</style>
