<template>
    <div>
        <h1>基础用法</h1>
        <div>
            <ivue-button @click="info">Display info prompt</ivue-button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        info() {
            this.$message.info('This is a info tip');
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
