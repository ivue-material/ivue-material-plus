<template>
    <div>
        <ivue-tabs v-model="tab">
            <template #header>
                <ivue-tab v-for="n in 30" :key="`item${n}`" :name="`item${n}`">Item {{ n }}</ivue-tab>
            </template>

            <template #content>
                <ivue-tab-item v-for="i in 30" :id="'tab-' + i" :key="i">{{ text }}{{i}}</ivue-tab-item>
            </template>
        </ivue-tabs>
        <!-- <ivue-button v-on:click="add">Add</ivue-button>
        <ivue-button v-on:click="remove">Remove</ivue-button>-->
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            nextNum: 10,
            tab: '',
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
