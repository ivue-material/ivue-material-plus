<template>
    <div>
        <h1>顶部导航</h1>
        <ivue-menu mode="horizontal" activeName="1">
            <ivue-menu-item name="1">内容管理1</ivue-menu-item>
            <ivue-menu-item name="2">内容管理2</ivue-menu-item>

            <ivue-submenu name="3">
                <template #title>统计分析</template>
                <!-- <MenuGroup title="使用">
                    <MenuItem name="3-1">新增和启动</MenuItem>
                    <MenuItem name="3-2">活跃分析</MenuItem>
                    <MenuItem name="3-3">时段分析</MenuItem>
                </MenuGroup>
                <MenuGroup title="留存">
                    <MenuItem name="3-4">用户留存</MenuItem>
                    <MenuItem name="3-5">流失用户</MenuItem>
                </MenuGroup> -->
            </ivue-submenu>
        </ivue-menu>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
