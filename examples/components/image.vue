<template>
    <div>
        <h1>基础用法</h1>
        <p>可通过fit确定图片如何适应到容器框，同原生 object-fit。</p>
        <div v-for="fit in fits" :key="fit" class="block">
            <span class="demonstration">{{ fit }}</span>
            <ivue-image style="width: 100px; height: 100px" :src="url" :fit="fit" />
        </div>
        <h1>占位</h1>
        <p>可通过 slot: loading 自定义加载时的占位内容</p>
        <ivue-image
            style="width: 100px; height: 100px"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        >
            <template #loading>占位</template>
        </ivue-image>
        <h1>图片加载失败</h1>
        <p>可通过 slot: error 设置加载失败占位内容</p>
        <ivue-image style="width: 100px; height: 100px">
            <template #error>图片加载失败</template>
        </ivue-image>
        <h1>懒加载</h1>
        <ivue-image
            style="width: 100px; height: 100px"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            lazy
        ></ivue-image>
        <h1>图片预览</h1>
        <template v-for="(url, index) in urlList" :key="url">
            <ivue-image
                :src="url"
                fit="contain"
                width="120px"
                height="80px"
                preview
                :preview-list="urlList"
                :initial-index="index"
            ></ivue-image>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            urlList: [
                'https://file.iviewui.com/images/image-demo-1.jpg',
                'https://file.iviewui.com/images/image-demo-2.jpg',
                'https://file.iviewui.com/images/image-demo-3.jpg',
                'https://file.iviewui.com/images/image-demo-4.jpg',
                'https://file.iviewui.com/images/image-demo-5.jpg',
                'https://file.iviewui.com/images/image-demo-6.jpg',
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
