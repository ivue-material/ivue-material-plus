<template>
    <div>
        <h1>基本用法</h1>
        {{dates}}
        <ivue-date-picker v-model="dates"></ivue-date-picker>
        <h1>日历变为横向 设置为多选 宽度百分百</h1>
        <ivue-date-picker v-model="dates" headerColor="red" color="blue" landscape fullWidth></ivue-date-picker>

        <h1>显示为月份</h1>
        {{dates}}
        <ivue-date-picker v-model="dates" type="month"></ivue-date-picker>
        <h1>方向</h1>
        <ivue-date-picker v-model="dates" :landscape="landscape"></ivue-date-picker>

        <ivue-button @click="landscape = true">landscape</ivue-button>

        <ivue-button @click="landscape = false">reactive</ivue-button>
        <h1>颜色</h1>
        <ivue-date-picker v-model="dates" color="#FF4772"></ivue-date-picker>
        <ivue-date-picker v-model="dates" header-color="green"></ivue-date-picker>
        <h1>允许选择的日期</h1>
        <ivue-date-picker v-model="dates" :allowed-dates="allowedDates"></ivue-date-picker>
        <h1>多选</h1>
        <ivue-date-picker v-model="multipledates" multiple></ivue-date-picker>
        {{multipledates}}
        <h1>语言</h1>
        <ivue-date-picker v-model="dates" locale="zh-CH" :showCurrent="false"></ivue-date-picker>
        <h1>便签</h1>
        <p>function</p>
        <ivue-date-picker
            v-model="dates"
            :note="arrayEvents"
            :noteColor="date => date[9] % 2 ? 'red' : 'yellow'"
        ></ivue-date-picker>
        <h1>一周的第一天</h1>
        <ivue-date-picker v-model="dates" firstDayOfWeek="0"></ivue-date-picker>
        <ivue-date-picker v-model="dates" firstDayOfWeek="1"></ivue-date-picker>
        <h1>图标设置</h1>
        <ivue-date-picker
            v-model="dates"
            nextIcon="arrow_right"
            prevIcon="arrow_left"
            yearIcon="event_note"
        ></ivue-date-picker>

        <h1>只读</h1>
        <ivue-date-picker v-model="dates" readonly></ivue-date-picker>
        <ivue-date-picker v-model="dates" type="month" readonly></ivue-date-picker>

        <h1>noTitle</h1>
        <ivue-date-picker v-model="dates" noTitle @input="handleInput"></ivue-date-picker>

        <h1>width</h1>
        <ivue-date-picker v-model="dates" width="500"></ivue-date-picker>
        <h1>max min</h1>
        <ivue-date-picker v-model="picker" min="2010-06-15" max="2019-03-20"></ivue-date-picker>
        <h1>reactive 点击月份或者年份时日期月份或年份是否跟随改变</h1>
        <ivue-date-picker v-model="dates" reactive></ivue-date-picker>
        <ivue-date-picker v-model="dates" locale="zh-CH" reactive :showCurrent="false"></ivue-date-picker>

        <h1>pickerDate</h1>
        <ivue-date-picker v-model="picker" v-model:pickerDate="pickerDate"></ivue-date-picker>

        <h1>titleDateFormat</h1>
        <ivue-date-picker
            v-model="picker"
            :titleDateFormat="format('zh-CN',{ weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })"
        ></ivue-date-picker>

        <h1>titleYearFormat</h1>
        <ivue-date-picker
            v-model="picker"
            :titleYearFormat="titleYearFormat('zh-CN',{ year: 'numeric', timeZone: 'UTC' })"
        ></ivue-date-picker>

        <h1>dayFormat</h1>
          <ivue-date-picker
            v-model="picker"
        ></ivue-date-picker>

        <ivue-date-picker
            v-model="picker"
            :dayFormat="format('zh-CN',{ day: 'numeric', timeZone: 'UTC' })"
        ></ivue-date-picker>

        <h1>monthFormat</h1>
         <ivue-date-picker
            v-model="picker"
        ></ivue-date-picker>
        <ivue-date-picker
            v-model="picker"
            :monthFormat="format('zh-CN',{ month: 'short', timeZone: 'UTC' })"
        ></ivue-date-picker>

        <h1>headerDateFormat</h1>
           <ivue-date-picker
            v-model="picker"
        ></ivue-date-picker>
        <ivue-date-picker
            v-model="picker"
            :headerDateFormat="format('zh-CN',{ month: 'long', year: 'numeric', timeZone: 'UTC' })"
        ></ivue-date-picker>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dates: new Date().toISOString().substr(0, 10),
            multipledates: [],
            landscape: false,
            arrayEvents: [],
            picker: '2016-06-15',
            pickerDate: null,
        };
    },
    mounted() {
        this.arrayEvents = [...Array(6)].map(() => {
            const day = Math.floor(Math.random() * 30);
            const d = new Date();
            d.setDate(day);
            return d.toISOString().substr(0, 10);
        });
    },
    methods: {
        allowedDates: (val) => {
            return parseInt(val.split('-')[2], 10) % 2 === 0;
        },
        handleInput(value) {
            console.log(value);
        },
        format(locale, options) {
            // 适配IOS
            const makeIsoString = (dateString) => {
                const [year, month, date] = dateString
                    .trim()
                    .split(' ')[0]
                    .split('-');

                return [
                    year,
                    this.padStart(month || 1, 2, 0),
                    this.padStart(date || 1, 2, 0),
                ].join('-');
            };
            // 初始化 根据语言来格式化日期和时间的对象
            const intlFormatter = new Intl.DateTimeFormat(
                locale || undefined,
                options
            );

            return (dateString) => {
                return intlFormatter.format(
                    new Date(`${makeIsoString(dateString)}T00:00:00+00:00`)
                );
            };
        },
        titleDateFormat(
            locale,
            options,
            { start, length } = { start: 0, length: 0 }
        ) {
            // 适配IOS
            const makeIsoString = (dateString) => {
                const [year, month, date] = dateString
                    .trim()
                    .split(' ')[0]
                    .split('-');

                return [year, month, date].join('-');
            };
            // 初始化 根据语言来格式化日期和时间的对象
            const intlFormatter = new Intl.DateTimeFormat(
                locale || undefined,
                options
            );

            return (dateString) => {
                return '12月12日周三';
            };
        },
        titleYearFormat(locale, options) {
            // 适配IOS
            const makeIsoString = (dateString) => {
                const [year, month, date] = dateString
                    .trim()
                    .split(' ')[0]
                    .split('-');

                return [year, month, date].join('-');
            };
            // 初始化 根据语言来格式化日期和时间的对象
            const intlFormatter = new Intl.DateTimeFormat(
                locale || undefined,
                options
            );

            return (dateString) => {
                return '12月12日周三';
            };
        },
        padStart(string, targetLength, padString) {
            targetLength = targetLength >> 0;
            string = String(string);
            padString = String(padString);
            if (string.length > targetLength) {
                return String(string);
            }

            targetLength = targetLength - string.length;

            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }

            return padString.slice(0, targetLength) + String(string);
        },
    },
    watch: {
        pickerDate(val) {
            console.log('pickerDate', val);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
