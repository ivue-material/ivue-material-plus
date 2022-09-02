<template>
    <div>
        <h1>基础用法</h1>
        <span strong>目标值：1000，持续时间：6秒</span>

        <h1>
            <ivue-count-up :endValue="1000" :duration="6" ref="count"></ivue-count-up>
        </h1>
        <h1>
            <ivue-button @click="handlePause">暂停/继续</ivue-button>
            <ivue-button @click="handleReset">重置</ivue-button>
            <ivue-button @click="handleStart">开始</ivue-button>
            <ivue-button @click="handleUpdate">更新至：</ivue-button>
        </h1>
        <h1>小数</h1>
        <span>目标值：1000，持续时间：6秒，小数位数：2位</span>
        <h1>
            <ivue-count-up :endValue="1000" :duration="6" :decimals="2" ref="count1"></ivue-count-up>
        </h1>
        <h1>回调</h1>
        <h1>
            <ivue-count-up :endValue="end" :duration="6" :callback="handleUpdateEnd"></ivue-count-up>
        </h1>
        <h1>自定义设置项</h1>
        <h1>
            <ivue-count-up :endValue="1000" :duration="6" :options="options"></ivue-count-up>
        </h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            update: 5000,
            end: 50,
            options: {
                useEasing: false,
                useGrouping: false,
            },
        };
    },
    methods: {
        handlePause() {
            this.$refs.count.pauseResume();
        },
        handleReset() {
            this.$refs.count.reset();
        },
        handleStart() {
            this.$refs.count.start();
        },
        handleUpdate() {
            this.$refs.count.update(this.update);
        },
        handleUpdateEnd() {
            setTimeout(() => {
                this.end = 100;
            }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
