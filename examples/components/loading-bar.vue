<template>
    <div>
        <ivue-button @click="start">Start</ivue-button>
        <ivue-button @click="finish">Finish</ivue-button>
        <ivue-button @click="error">Error</ivue-button>
        <ivue-button @click="update">update</ivue-button>
        <ivue-button @click="config">config</ivue-button>
        <ivue-button @click="destroy">destroy</ivue-button>
    </div>
</template>

<script>
export default {
    methods: {
        start() {
            this.$LoadingBar.start();
            setTimeout(() => {
                this.$LoadingBar.finish();
            }, 1000);
        },
        finish() {
            this.$LoadingBar.finish();
        },
        error() {
            this.$LoadingBar.error();
        },
        update() {
            this.$LoadingBar.update(50);
        },
        config() {
            this.$LoadingBar.config({
                color: 'red',
                height: 100,
            });
        },
        destroy() {
            this.$LoadingBar.destroy();
        },
    },
};
</script>

<style>
</style>
