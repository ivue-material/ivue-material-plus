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
    </div>
</template>

<script>
import {
    h,
} from 'vue';

export default {
    methods: {
        renderFunc() {
            this.$notice.success({
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
            this.$notice.open({
                title: 'Notification title',
                desc: 'This notification does not automatically close, and you need to click the close button to close.',
                duration: 0,
            });
        },
        open(nodesc) {
            this.$notice.open({
                title: 'Notification title',
                duration: 0,
                desc: nodesc
                    ? ''
                    : 'Here is the notification description. Here is the notification description. ',
            });
        },
        info(nodesc) {
            this.$notice.info({
                title: 'Notification title',
                desc: nodesc
                    ? ''
                    : 'Here is the notification description. Here is the notification description. ',
            });
        },
        success(nodesc) {
            this.$notice.success({
                title: 'Notification title',
                desc: nodesc
                    ? ''
                    : 'Here is the notification description. Here is the notification description. ',
            });
        },
        warning(nodesc) {
            this.$notice.warning({
                title: 'Notification title',
                desc: nodesc
                    ? ''
                    : 'Here is the notification description. Here is the notification description. ',
            });
        },
        error(nodesc) {
            this.$notice.error({
                title: 'Notification title',
                desc: nodesc
                    ? ''
                    : 'Here is the notification description. Here is the notification description. ',
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
