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
import { IvueLoadingBar } from '@ivue-material-plus/components';

export default {
  methods: {
    start() {
      IvueLoadingBar.start();
      setTimeout(() => {
        // IvueLoadingBar.finish();
      }, 1000);
    },
    finish() {
      IvueLoadingBar.finish();
    },
    error() {
      IvueLoadingBar.error();
    },
    update() {
      IvueLoadingBar.update(50);
    },
    config() {
      IvueLoadingBar.config({
        color: '#27E2B2',
        failedColor: '#FFBD3C',
        height: 50,
        duration: 2000,
      });
    },
    destroy() {
      IvueLoadingBar.destroy();
    },
  },
};
</script>

<style lang="less">
@import '../../packages/components/ivue-loading-bar/index.less';
</style>
