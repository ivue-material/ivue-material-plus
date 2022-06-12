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
        <ivue-checkbox-group v-model="disabledGroup">
            <ivue-checkbox label="香蕉"></ivue-checkbox>
            <ivue-checkbox label="苹果"></ivue-checkbox>
            <ivue-checkbox label="西瓜"></ivue-checkbox>
        </ivue-checkbox-group>
        {{fruit}}
        <h1>不可用</h1>
        <ivue-checkbox v-model="disabledSingle" disabled>ivue-checkbox</ivue-checkbox>
        <ivue-checkbox-group v-model="disabledGroup">
            <ivue-checkbox label="香蕉" disabled></ivue-checkbox>
            <ivue-checkbox label="苹果" disabled></ivue-checkbox>
            <ivue-checkbox label="西瓜"></ivue-checkbox>
        </ivue-checkbox-group>

        <h1>显示边框</h1>
        <ivue-checkbox-group v-model="border">
            <ivue-checkbox label="香蕉" border disabled></ivue-checkbox>
            <ivue-checkbox label="苹果" border></ivue-checkbox>
            <ivue-checkbox label="西瓜" border></ivue-checkbox>
        </ivue-checkbox-group>
        <h1>全选</h1>
        <ivue-checkbox
            :indeterminate="indeterminate"
            :model-value="checkAll"
            @click.prevent="handleCheckAll"
        >全选</ivue-checkbox>

        <ivue-checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <ivue-checkbox label="香蕉"></ivue-checkbox>
            <ivue-checkbox label="苹果"></ivue-checkbox>
            <ivue-checkbox label="西瓜" border></ivue-checkbox>
        </ivue-checkbox-group>
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
            border: [],
            indeterminate: true,
            checkAll: false,
            checkAllGroup: ['香蕉', '西瓜'],
        };
    },
    methods: {
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                this.checkAllGroup = ['香蕉', '苹果', '西瓜'];
            } else {
                this.checkAllGroup = [];
            }
        },
        checkAllGroupChange(data) {
            if (data.length === 3) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
