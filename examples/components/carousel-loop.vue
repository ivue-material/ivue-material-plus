<template>
    <div>
        <h1>基础用法</h1>
        <ivue-carousel-loop>
            <img
                class="image"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                v-for="i in 10"
                :key="i"
            />
        </ivue-carousel-loop>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.image {
    width: 100px;
    height: 100px;
}
</style>
