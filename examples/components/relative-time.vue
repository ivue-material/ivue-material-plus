<template>
    <div class="card">
        <h1>基础用法</h1>
        <div>
            <ivue-relative-time :time="time1"></ivue-relative-time>
        </div>
        <div>
            <ivue-relative-time :time="time2"></ivue-relative-time>
        </div>
        <h1>自动更新间隔</h1>
        <ivue-relative-time :time="time1"></ivue-relative-time>
        <h1>不同类型</h1>
        <div>
            <ivue-relative-time :time="time2"></ivue-relative-time>
        </div>
        <div>
            <ivue-relative-time :time="time2" type="date"></ivue-relative-time>
        </div>
        <div>
            <ivue-relative-time :time="time2" type="datetime"></ivue-relative-time>
        </div>
        <h1>locale</h1>
        <div>
            <ivue-relative-time :time="time" :locale="locale"></ivue-relative-time>
        </div>
        <div>
            <ivue-relative-time :time="new Date().getTime() + 10000" :locale="locale"></ivue-relative-time>
        </div>
        <div>
            <ivue-relative-time :time="time1" :locale="locale"></ivue-relative-time>
        </div>
        <div>
            <ivue-relative-time :time="new Date().getTime() + 10000000" :locale="locale"></ivue-relative-time>
        </div>
        <div>
            <ivue-relative-time :time="time2" :locale="locale"></ivue-relative-time>
        </div>
        <h1>自定义日期方法</h1>

        <ivue-relative-time :time="time2" :dateFunction="dateFunction"></ivue-relative-time>
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: new Date(),
            time1: new Date().getTime() - 60 * 3 * 1000,
            time2: new Date().getTime() - 86400 * 3 * 1000,
            locale: {
                just: 'just',
                before: 'before',
                after: 'after',
                seconds: 'seconds',
                minutes: 'minutes',
                days: 'days',
                hours: 'hours',
            },
        };
    },
    methods: {
        dateFunction(timeStamp, diff, _isEarly) {
            console.log(timeStamp, diff, _isEarly);
            return '自定义时间'
        },
    },
};
</script>

<style lang="scss" scoped>
.card {
    height: 1000px;
}
</style>
