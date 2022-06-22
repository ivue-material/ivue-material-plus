<template>
    <div>
        <h1>基本</h1>
        <ivue-page :total="100" showTotal>
                <template #prev>
                    上一夜
                </template>
        </ivue-page>
        <span>showTotal</span>
        <ivue-page :total="100" showTotal></ivue-page>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
