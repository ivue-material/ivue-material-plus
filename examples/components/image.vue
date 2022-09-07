<template>
    <div>
        <h1>基础用法</h1>
        <p>可通过fit确定图片如何适应到容器框，同原生 object-fit。</p>
        <div v-for="fit in fits" :key="fit" class="block">
            <span class="demonstration">{{ fit }}</span>
            <ivue-image style="width: 100px; height: 100px" :src="url" :fit="fit" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
