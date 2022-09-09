<template>
    <div>
        <h1>基础用法</h1>
        <ivue-notice-bar
            background="#27E2B2"
            textColor="#FFBD3C"
            leftIcon="volume_up"
            mode="link"
            text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。"
            @on-replay="handleReplay"
        ></ivue-notice-bar>
        <h1>滚动播放</h1>
        <!-- 文字较短时，通过设置 scrollable 属性开启滚动播放 -->
        <ivue-notice-bar scrollable text="米袋虽空——樱花开哉！"></ivue-notice-bar>
        <!-- 文字较长时，通过禁用 scrollable 属性关闭滚动播放 -->
        <ivue-notice-bar :scrollable="false" text="不会回头的东西有四件：说出口的话、离弦的箭、逝去的生活和失去的机会。"></ivue-notice-bar>
        <h1>多行展示</h1>
        <ivue-notice-bar wrapable :scrollable="false" text="不会回头的东西有四件：说出口的话、离弦的箭、逝去的生活和失去的机会。"></ivue-notice-bar>
        <h1>通知栏模式</h1>
        <!-- 文字较短时，通过设置 scrollable 属性开启滚动播放 -->
        <ivue-notice-bar mode="closeable" text="米袋虽空——樱花开哉！"></ivue-notice-bar>
        <!-- link 模式，在右侧显示链接箭头 -->
        <ivue-notice-bar mode="link">米袋虽空——樱花开哉！</ivue-notice-bar>
    </div>
</template>

<script>
export default {
    methods: {
        handleReplay() {
            console.log('handleReplay');
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
