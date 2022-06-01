<template>
    <div>
        <h1>单独使用</h1>
        <ivue-checkbox v-model="single" label="Checkbox"></ivue-checkbox>
        <ivue-checkbox v-model="single" label="Checkbox">12</ivue-checkbox>
        {{single}}
        <h1>组合使用</h1>
        <ivue-checkbox-group v-model="fruit">
            <ivue-checkbox label="香蕉"></ivue-checkbox>
            <ivue-checkbox label="苹果"></ivue-checkbox>
            <ivue-checkbox label="西瓜"></ivue-checkbox>
        </ivue-checkbox-group>
        {{fruit}}
    </div>
</template>

<script>
export default {
    data() {
        return {
            single: false,
            fruit: ['苹果'],
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
