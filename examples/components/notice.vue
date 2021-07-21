<template>
    <div>
        <ivue-button @click="open(false)">Open notice</ivue-button>
    </div>
</template>

<script>
export default {
    methods: {
        open(nodesc) {
        this.$IvueNotice()
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
