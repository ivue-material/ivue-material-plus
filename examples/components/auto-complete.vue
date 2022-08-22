<template>
    <div>
        <h1>基础用法</h1>
        <ivue-auto-complete
            v-model="value"
            :list="data"
            @on-search="handleSearch"
            placeholder="请输入"
        ></ivue-auto-complete>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            data: [],
        };
    },
    methods: {
        handleSearch(value) {
            this.data = !value
                ? []
                : [value, value + value, value + value + value];
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
