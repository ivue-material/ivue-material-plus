<template>
    <div>
        <!-- 基本用法 -->
        <p>基本用法 分页</p>
        <ivue-tabs v-model="tab">
            <template #header>
                <ivue-tab v-for="n in 30" :key="`item${n}`" :name="`item${n}`">Item {{ n }}</ivue-tab>
            </template>

            <template #content>
                <ivue-tab-item v-for="i in 30" :id="'tab-' + i" :key="i">{{ text }}{{i}}</ivue-tab-item>
            </template>
        </ivue-tabs>
        <p>固定选项卡</p>
        <ivue-tabs fixedTabs v-model="tab">
            <template #header>
                <ivue-tab v-for="n in 3" :key="`item${n}`" :name="`item${n}`">Item {{ n }}</ivue-tab>
            </template>

            <template #content>
                <ivue-tab-item v-for="i in 3" :id="'tab-' + i" :key="i">{{ text }}{{i}}</ivue-tab-item>
            </template>
        </ivue-tabs>
        <p>标签右对齐</p>
        <ivue-tabs right v-model="tab">
            <template #header>
                <ivue-tab v-for="n in 3" :key="`item${n}`" :name="`item${n}`">Item {{ n }}</ivue-tab>
            </template>

            <template #content>
                <ivue-tab-item v-for="i in 3" :id="'tab-' + i" :key="i">{{ text }}{{i}}</ivue-tab-item>
            </template>
        </ivue-tabs>
        <p>自定义图标</p>
        <ivue-tabs prevIcon="arrow_back" nextIcon="arrow_forward"  v-model="tab">
            <template #header>
                <ivue-tab v-for="n in 30" :key="`item${n}`" :name="`item${n}`">Item {{ n }}</ivue-tab>
            </template>

            <template #content>
                <ivue-tab-item v-for="i in 30" :id="'tab-' + i" :key="i">{{ text }}{{i}}</ivue-tab-item>
            </template>
        </ivue-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            nextNum: 10,
            tab: 'item1',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        };
    },
    methods: {
        randomIndex: function () {
            return Math.floor(Math.random() * this.items.length);
        },
        add: function () {
            this.items.splice(this.randomIndex(), 0, this.nextNum++);
        },
        remove: function () {
            this.items.splice(this.randomIndex(), 1);
        },
    },
};
</script>

<style lang="scss" scoped>
.contnet {
    width: 500px;
}
</style>
