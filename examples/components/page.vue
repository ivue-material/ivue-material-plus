<template>
    <div>
        <h1>基本</h1>

        <h1>普通条数</h1>

        <p>没有更多</p>
        <ivue-page :total="50"></ivue-page>
        <p>有更多</p>
        <ivue-page :total="1000" :pagerCount="5"></ivue-page>
        <p>slot 左 有 页数</p>
        <ivue-page :total="1000">
            <template #prev>上一页</template>
            <template #prevArrow>上一页更多</template>
            <template #next>下一页</template>
            <template #nextArrow>下一页更多</template>
        </ivue-page>
        <h1>每页数量</h1>
        <ivue-page :total="100" showSizer></ivue-page>
        <p>页数选择文字</p>
        <ivue-page :total="100" showSizer pageSizeText="条" :pageSizeOpts="[10,20]"></ivue-page>

        <h1>总数</h1>
        <ivue-page :total="100" showTotal></ivue-page>
        <h1>电梯</h1>
        <ivue-page :total="100" showElevator></ivue-page>
        <ivue-page :total="100" showElevator :elevatorText="['第一个', '第二个']"></ivue-page>
        <h1>迷你型</h1>
        <ivue-page :total="100" small showTotal  showSizer showElevator></ivue-page>
        <h1>简洁</h1>
        <ivue-page :total="100" simple></ivue-page>

    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
