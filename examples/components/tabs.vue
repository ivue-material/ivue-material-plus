<template>
    <div>
        <ivue-tabs>
            <ivue-tab v-for="n in 30" :key="`item${n}`">Item {{ n }}</ivue-tab>
        </ivue-tabs>

        {{items}}

        <ivue-button v-on:click="add">Add</ivue-button>
        <ivue-button v-on:click="remove">Remove</ivue-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            nextNum: 10
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
</style>
