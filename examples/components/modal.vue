<template>
    <div>
        <h1>基础用法</h1>
        {{modal}}
        <ivue-button type="primary" @click="modal = true">Display dialog box</ivue-button>
        <ivue-modal v-model="modal" :beforeClose="beforeClose"></ivue-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            modal: false,
        };
    },
    methods: {
        ok() {},
        cancel() {},
        beforeClose() {
            console.log('beforeClose');
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
