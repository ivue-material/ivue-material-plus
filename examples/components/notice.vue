<template>
  <div>
    <h1>基础用法</h1>

    <div>
      <ivue-button @click="open(false)">Open notice</ivue-button>
      <ivue-button @click="open(true)">Open notice(only title)</ivue-button>
    </div>
    <h1>提醒类型</h1>
    <div>
      <p>With desc</p>
      <ivue-button @click="info(false)">Info</ivue-button>
      <ivue-button @click="success(false)">Success</ivue-button>
      <ivue-button @click="warning(false)">Warning</ivue-button>
      <ivue-button @click="error(false)">Error</ivue-button>
      <p>Only title</p>
      <ivue-button @click="info(true)">Info</ivue-button>
      <ivue-button @click="success(true)">Success</ivue-button>
      <ivue-button @click="warning(true)">Warning</ivue-button>
      <ivue-button @click="error(true)">Error</ivue-button>
    </div>
    <h1>自定义时长</h1>
    <div>
      <ivue-button @click="time">Open notice</ivue-button>
    </div>
    <h1>Render 函数</h1>
    <div>
      <ivue-button @click="renderFunc">Open notice</ivue-button>
    </div>
    <h1>自定义弹出位置</h1>
    <div>
      <ivue-button @click="open1">右上角</ivue-button>
      <ivue-button @click="open2">右下角</ivue-button>
      <ivue-button @click="open3">左下角</ivue-button>
      <ivue-button @click="open4">左上角</ivue-button>
    </div>
    <h1>带有偏移</h1>
    <div>
      <ivue-button @click="offsert">偏移的消息</ivue-button>
    </div>
    <h1>隐藏关闭按钮</h1>
    <div>
      <ivue-button @click="showClose">隐藏关闭按钮</ivue-button>
    </div>
    <h1>关闭所有实利</h1>
    <div>
      <ivue-button @click="showCloseAll">关闭所有实利</ivue-button>
    </div>
  </div>
</template>

<script>
import { IvueNotice } from '@ivue-material-plus/components';

import { h } from 'vue';

export default {
  components: {
    IvueNotice,
  },
  mounted() {
    console.log(this);
  },
  methods: {
    showCloseAll() {
      IvueNotice.closeAll();
    },
    showClose() {
      IvueNotice.open({
        title: '偏移',
        desc: '这是一条带有偏移的提示消息',
        offset: 100,
        closable: false,
      });
    },
    offsert() {
      IvueNotice.open({
        title: '偏移',
        desc: '这是一条带有偏移的提示消息',
        offset: 100,
      });
    },
    open1() {
      IvueNotice.open({
        title: '自定义位置',
        desc: '右上角弹出的消息',
      });
    },

    open2() {
      IvueNotice.open({
        title: '自定义位置',
        desc: '右下角弹出的消息',
        position: 'bottom-right',
      });
    },

    open3() {
      IvueNotice.open({
        title: '自定义位置',
        desc: '左下角弹出的消息',
        position: 'bottom-left',
      });
    },

    open4() {
      IvueNotice.open({
        title: '自定义位置',
        desc: '左上角弹出的消息',
        position: 'top-left',
      });
    },
    renderFunc() {
      IvueNotice.success({
        title: 'Notification title',
        desc: 'The desc will hide when you set render.',
        render: () => {
          return h('span', [
            'This is created by ',
            h('a', 'render'),
            ' function',
          ]);
        },
      });
    },
    time() {
      IvueNotice.open({
        title: 'Notification title',
        desc: 'This notification does not automatically close, and you need to click the close button to close.',
      });
    },
    open(nodesc) {
      const success = IvueNotice.success({
        title: 'Notification title',
        styles: 'color:red',
        desc: nodesc
          ? ''
          : 'Here is the notification description. Here is the notification description. ',
        id: 'id',
        duration: 0,
      });

      console.log('12');

      // this.setTimeout && clearTimeout(this.setTimeout)
      setTimeout(() => {
        console.log(success);
        success && success.close('id');
      }, 1000);
    },
    info(nodesc) {
      IvueNotice.info({
        duration: 0,
        title: 'Notification title',
        desc: nodesc
          ? ''
          : 'Here is the notification description. Here is the notification description. ',
      });
    },
    success(nodesc) {
      IvueNotice.success({
        title: 'Notification title',
        desc: nodesc
          ? ''
          : 'Here is the notification description. Here is the notification description. ',
      });
    },
    warning(nodesc) {
      IvueNotice.warning({
        title: 'Notification title',
        desc: nodesc
          ? ''
          : 'Here is the notification description. Here is the notification description. ',
      });
    },
    error(nodesc) {
      IvueNotice.error({
        title: 'Notification title',
        desc: nodesc
          ? ''
          : 'Here is the notification description. Here is the notification description. ',
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
