<template>
    <div>
        <h1>日历变为横向 设置为多选 宽度百分百</h1>
        <ivue-date-picker v-model="dates"></ivue-date-picker>
        <h1>landscape</h1>
        <!-- <ivue-date-picker landscape fullWidth></ivue-date-picker> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            dates: new Date().toISOString().substr(0, 10),
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
