<template>
    <div>
        <h1>基础用法</h1>
        <ivue-input-number :max="10" :min="1" :precision="2" :activeChange="false" v-model="value"></ivue-input-number>
        {{value}}
        <h1>小数</h1>
        <ivue-input-number :max="10" :min="1" :step="1.2" v-model="value1"></ivue-input-number>
        {{value1}}
        <h1>格式化展示</h1>
        <ivue-input-number
            v-model="value2"
            :max="10000"
            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        ></ivue-input-number>
        {{value2}}
        <ivue-input-number
            v-model="value3"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
        ></ivue-input-number>
        {{value3}}
        <h1>不可用</h1>
        <ivue-input-number disabled></ivue-input-number>
        <h1>只读</h1>
        <ivue-input-number v-model="value" readonly></ivue-input-number>
        <h1>editable</h1>
        <ivue-input-number v-model="value4" :editable="false"></ivue-input-number>
        <h1>按钮位置</h1>
        <ivue-input-number :max="10" :min="1" v-model="value5" controlsOutside></ivue-input-number>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: 1,
            value1: 1,
            value2: 1000,
            value3: 100,
            value4: 1,
            value5: 1,
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
