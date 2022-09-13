<template>
    <div>
        <h1>倒计时</h1>
        <ivue-count-down :target="targetTime1">
            <template v-slot="slotProps">倒计时:{{slotProps.countDown}}</template>
        </ivue-count-down>
        <h1>倒计时 on-end</h1>
        <ivue-count-down :target="targetTime2" @on-end="handleEnd">
            <template
                v-slot="slotProps"
            >{{ slotProps.countDown === '00:00:00' ? '倒计时完成' : slotProps.countDown }}</template>
        </ivue-count-down>
        <h1>倒计时数字</h1>
        <ivue-count-down :target="10000" type="number" @on-end="handleEnd"></ivue-count-down>
    </div>
</template>

<script>
export default {
    data() {
        return {
            targetTime1: new Date().getTime() + 3900000,
            targetTime2: new Date().getTime() + 30000,
        };
    },
    methods: {
        handleEnd() {
            this.$message.info('倒计时结束');
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
