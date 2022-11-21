<template>
    <div>
        <h1>顶部导航</h1>
        <ivue-menu mode="horizontal" activeName="3-1" theme="dark">
            <ivue-menu-item name="1">内容管理1</ivue-menu-item>
            <ivue-menu-item name="2">内容管理2</ivue-menu-item>

            <ivue-submenu name="3">
                <template #title>统计分析</template>
                <ivue-menu-group title="使用">
                    <ivue-menu-item name="3-1">新增和启动</ivue-menu-item>
                    <ivue-menu-item name="3-2">活跃分析</ivue-menu-item>
                    <ivue-menu-item name="3-3">时段分析</ivue-menu-item>
                </ivue-menu-group>
                <ivue-menu-group title="留存">
                    <ivue-menu-item name="3-4">用户留存</ivue-menu-item>
                    <ivue-menu-item name="3-5">流失用户</ivue-menu-item>
                </ivue-menu-group>
            </ivue-submenu>
        </ivue-menu>
        <h1>侧栏导航</h1>
        <ivue-menu @on-open-change="handleOpenChange" @on-select="handleSelect">
            <ivue-menu-item name="1">内容管理1</ivue-menu-item>
            <ivue-submenu name="3">
                <template #title>统计分析</template>
                <ivue-menu-group title="使用">
                    <ivue-menu-item name="3-1">新增和启动</ivue-menu-item>
                    <ivue-menu-item name="3-2">活跃分析</ivue-menu-item>
                    <ivue-menu-item name="3-3">时段分析</ivue-menu-item>
                </ivue-menu-group>
                <ivue-menu-group title="留存">
                    <ivue-menu-item name="3-4">用户留存</ivue-menu-item>
                    <ivue-menu-item name="3-5">流失用户</ivue-menu-item>
                </ivue-menu-group>
            </ivue-submenu>
        </ivue-menu>
        <h2>activeName openNames</h2>
        <ivue-menu activeName="1-2" :openNames="['1']">
            <ivue-submenu name="1">
                <template #title>内容管理</template>
                <ivue-menu-item name="1-1">文章管理</ivue-menu-item>
                <ivue-menu-item name="1-2">评论管理</ivue-menu-item>
                <ivue-menu-item name="1-3">举报管理</ivue-menu-item>
            </ivue-submenu>
            <ivue-submenu name="2">
                <template #title>用户管理</template>
                <ivue-menu-item name="2-1">新增用户</ivue-menu-item>
                <ivue-menu-item name="2-2">活跃用户</ivue-menu-item>
            </ivue-submenu>
            <ivue-submenu name="3">
                <template #title>统计分析</template>
                <ivue-menu-group title="使用">
                    <ivue-menu-item name="3-1">新增和启动</ivue-menu-item>
                    <ivue-menu-item name="3-2">活跃分析</ivue-menu-item>
                    <ivue-menu-item name="3-3">时段分析</ivue-menu-item>
                </ivue-menu-group>
                <ivue-menu-group title="留存">
                    <ivue-menu-item name="3-4">用户留存</ivue-menu-item>
                    <ivue-menu-item name="3-5">流失用户</ivue-menu-item>
                </ivue-menu-group>
            </ivue-submenu>
        </ivue-menu>
        <h2>accordion</h2>
        <ivue-menu :open-names="['1']" accordion>
            <ivue-menu-item name="1-1">文章管理</ivue-menu-item>

            <ivue-submenu name="1">
                <template #title>内容管理</template>
                <ivue-menu-item name="1-2">评论管理</ivue-menu-item>
                <ivue-menu-item name="1-3">举报管理</ivue-menu-item>
            </ivue-submenu>
            <ivue-submenu name="2">
                <template #title>用户管理</template>
                <ivue-menu-item name="2-1">新增用户</ivue-menu-item>
                <ivue-menu-item name="2-2">活跃用户</ivue-menu-item>
            </ivue-submenu>
            <ivue-submenu name="3">
                <template #title>统计分析</template>
                <ivue-menu-group title="使用">
                    <ivue-menu-item name="3-1">新增和启动</ivue-menu-item>
                    <ivue-menu-item name="3-2">活跃分析</ivue-menu-item>
                    <ivue-menu-item name="3-3">时段分析</ivue-menu-item>
                </ivue-menu-group>
                <ivue-menu-group title="留存">
                    <ivue-menu-item name="3-4">用户留存</ivue-menu-item>
                    <ivue-menu-item name="3-5">流失用户</ivue-menu-item>
                </ivue-menu-group>
            </ivue-submenu>
        </ivue-menu>

        <h1>内嵌菜单</h1>
        <ivue-menu>
            <ivue-submenu name="1">
                <template #title>内容管理</template>
                <ivue-menu-item name="1-2">评论管理</ivue-menu-item>
                <ivue-menu-item name="1-3">举报管理</ivue-menu-item>

                <ivue-submenu name="2">
                    <template #title>用户管理</template>
                    <ivue-menu-item name="2-1">新增用户</ivue-menu-item>
                    <ivue-menu-item name="2-2">活跃用户</ivue-menu-item>
                </ivue-submenu>
            </ivue-submenu>
        </ivue-menu>

        <h1>分组</h1>
        <ivue-menu width="600px">
            <ivue-menu-group title="使用">
                <ivue-menu-item name="3-1">新增和启动</ivue-menu-item>
                <ivue-menu-item name="3-2">活跃分析</ivue-menu-item>
                <ivue-menu-item name="3-3">时段分析</ivue-menu-item>
            </ivue-menu-group>
            <ivue-menu-group title="使用">
                <ivue-menu-item name="3-1">新增和启动</ivue-menu-item>
                <ivue-menu-item name="3-2">活跃分析</ivue-menu-item>
                <ivue-menu-item name="3-3">时段分析</ivue-menu-item>
            </ivue-menu-group>
        </ivue-menu>
    </div>
</template>

<script>
export default {
    methods: {
        handleOpenChange(name) {
            console.log(name);
        },
        handleSelect(name) {
            console.log(name);
        }
    },
};
</script>

<style lang="scss" scoped>
</style>
