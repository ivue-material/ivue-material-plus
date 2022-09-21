<template>
    <div>
        <h1>tooltip</h1>
        <ivue-ellipsis :text="text" :height="30" autoResize tooltip></ivue-ellipsis>
        <p>transfer</p>
        <ivue-ellipsis :text="text" autoResize tooltip theme="light" transfer></ivue-ellipsis>
        <h1>按照字符数省略</h1>
        <ivue-ellipsis :text="text" :length="100"></ivue-ellipsis>
        <h1>fullWidthRecognition</h1>
        <ivue-ellipsis :text="text" :length="100" fullWidthRecognition></ivue-ellipsis>
        <h1>按照高度省略</h1>
        <ivue-ellipsis :text="text" :height="30" style="width:400px;margin: 0 auto;"></ivue-ellipsis>
        <h1>按照行数省略</h1>
        <ivue-ellipsis :text="text" :lines="3" style="width:400px;margin: 0 auto;"></ivue-ellipsis>
        <h1>禁用</h1>
        <ivue-ellipsis
            :text="text"
            :lines="3"
            disabled
            style="width:400px;margin: 0 auto;"
            v-line-clamp="1"
        ></ivue-ellipsis>
        <h1>是否自动根据外层宽度动态改变</h1>
        <ivue-ellipsis :text="text" :height="30" autoResize></ivue-ellipsis>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: '史蒂夫·乔布斯（英语：Steve Jobs），是一名美国企业家、营销家和发明家，苹果公司的联合创始人之一，曾任董事长及首席执行官职位，NeXT创办人及首席执行官，也是皮克斯动画的创办人并曾任首席执行官，2006年为华特迪士尼公司的董事会成员。2017年9月苹果发布会举行的地方，以他命名为 Steve Jobs Theater 。',
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
