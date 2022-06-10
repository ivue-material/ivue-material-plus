<template>
    <div>
        <h1>单独使用</h1>
        <ivue-checkbox v-model="single" label="ivue-checkbox"></ivue-checkbox>
        <ivue-checkbox v-model="single" label="ivue-checkbox">12</ivue-checkbox>
        {{single}}
        <h1>组合使用</h1>
        <ivue-checkbox-group v-model="social">
            <ivue-checkbox label="twitter">
                <span>Twitter</span>
            </ivue-checkbox>
            <ivue-checkbox label="facebook">
                <span>Facebook</span>
            </ivue-checkbox>
            <ivue-checkbox label="github">
                <span>Github</span>
            </ivue-checkbox>
            <ivue-checkbox label="snapchat">
                <span>Snapchat</span>
            </ivue-checkbox>
        </ivue-checkbox-group>
        {{social}}
        <ivue-checkbox-group v-model="fruit">
            <ivue-checkbox label="香蕉"></ivue-checkbox>
            <ivue-checkbox label="苹果"></ivue-checkbox>
            <ivue-checkbox label="西瓜"></ivue-checkbox>
        </ivue-checkbox-group>
        {{fruit}}
        <h1>不可用</h1>
        <ivue-checkbox v-model="disabledSingle" disabled>ivue-checkbox</ivue-checkbox>
    </div>
</template>

<script>
export default {
    data() {
        return {
            single: false,
            fruit: ['苹果'],
            social: ['facebook', 'github'],
            disabledSingle: true,
            disabledGroup: ['苹果'],
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
