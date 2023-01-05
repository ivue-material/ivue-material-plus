<template>
    <div>
        <h1>典型表单</h1>
        <ivue-form label-width="120px">
            <ivue-form-item label="Activity name">
                <ivue-input v-model="form.name" />
            </ivue-form-item>
            <ivue-form-item>
                <ivue-input />
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

const onSubmit = () => {
    console.log('submit!');
};
</script>

<style lang="scss" scoped>
</style>
