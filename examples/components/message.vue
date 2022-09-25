<template>
    <div>
        <h1>基础用法</h1>
        <div>
            <ivue-button @click="info">Display info prompt</ivue-button>
        </div>

        <h1>提示类型</h1>
        <p>不同的提示状态：成功、警告、错误。</p>
        <div>
            <ivue-button @click="success">Display success prompt</ivue-button>
            <ivue-button @click="warning">Display warning prompt</ivue-button>
            <ivue-button @click="error">Display error prompt</ivue-button>
        </div>

        <h1>带背景色</h1>
        <p>设置属性 background 后，通知提示会显示背景色。</p>
        <div>
            <ivue-button @click="background('info')">显示普通提示</ivue-button>
            <ivue-button @click="background('success')">显示成功提示</ivue-button>
            <ivue-button @click="background('warning')">显示警告提示</ivue-button>
            <ivue-button @click="background('error')">显示错误提示</ivue-button>
        </div>
        <h1>加载中</h1>
        <p>Loading 的状态，并异步在某个时机移除</p>
        <div>
            <ivue-button @click="loading">Display loading...</ivue-button>
        </div>
        <h1>自定义时长</h1>
        <p>自定义时长，也可以在Message.config()中全局配置，详见API。</p>
        <div>
            <ivue-button @click="time">Displays a 10 second prompt</ivue-button>
        </div>
        <h1>可关闭</h1>
        <p>将参数设置为一个对象，并指定 closable 为 true 后可以手动关闭提示，完整参数详见API。</p>
        <div>
            <ivue-button @click="closable">Display a closable message</ivue-button>
        </div>
        <h1>自定义 Render 函数</h1>
        <p>使用 Render 函数自定义内容。</p>
        <div>
            <ivue-button @click="renderFunc">show message</ivue-button>
        </div>
        <h1>关闭所有实利</h1>
        <div>
            <ivue-button @click="showCloseAll">关闭所有实利</ivue-button>
        </div>
    </div>
</template>

<script>
import { h } from 'vue';

export default {
    mounted() {
        this.$message.config({
            offset: 200,
        });
    },
    methods: {
        showCloseAll() {
            this.$message.closeAll();
        },
        info() {
            this.$message.info({
                content: '这是一条带背景色的通知',
            });
        },
        success() {
            this.$message.success({
                content: '这是一条带背景色的通知',
                duration: 0,
            });
        },
        warning() {
            this.$message.warning({
                content: '这是一条带背景色的通知',
                duration: 0,
            });
        },
        error() {
            this.$message.error({
                content: '这是一条带背景色的通知',
                duration: 0,
            });
        },
        background(type) {
            this.$message[type]({
                background: true,
                content: '这是一条带背景色的通知',
            });
        },
        loading() {
            const msg = this.$message.loading({
                content: 'Loading...',
                duration: 0,
            });
            setTimeout(msg, 3000);
        },
        time() {
            this.$message.info({
                content: 'I ll be gone in 10 seconds',
                duration: 10000,
            });
        },
        closable() {
            this.$message.info({
                content: 'Tips for manual closing',
                duration: 0,
                closable: true,
            });
        },
        renderFunc() {
            this.$message.info({
                render: () => {
                    return h('span', [
                        'This is created by ',
                        h('a', 'render'),
                        ' function',
                    ]);
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
