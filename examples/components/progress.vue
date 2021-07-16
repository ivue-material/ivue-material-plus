<template>
    <div
    >
        <ivue-circular :percent="20"></ivue-circular>
        <ivue-circular :percent="20" indeterminate></ivue-circular>
    </div>
</template>

<script>
export default {
    methods: {
        openFullScreen2() {
            const loading = this.$ivueloading({
                target: 'button',
                text: 'Loading',
                iconText: 'settings',
                background: 'rgba(0, 0, 0, 0.7)',
                customClass: '123',
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
