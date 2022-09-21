<template>
    <div class="card">
        <h1>基础用法</h1>
        <ivue-back-top :bottom="100"></ivue-back-top>
        <h1>自定义样式</h1>
        <ivue-back-top :bottom="200">自定义样式</ivue-back-top>
        <h2>只修改图标</h2>
        <ivue-back-top :bottom="300">
            <template #icon>
                <ivue-icon>thumb_up</ivue-icon>
            </template>
        </ivue-back-top>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.card {
    height: 1000px;
}
</style>
