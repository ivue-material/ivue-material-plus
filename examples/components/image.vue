<template>
    <div>
        <h1>基础用法</h1>
        <p>可通过fit确定图片如何适应到容器框，同原生 object-fit。</p>
        <div v-for="fit in fits" :key="fit" class="block">
            <span class="demonstration">{{ fit }}</span>
            <ivue-image style="width: 100px; height: 100px" :src="url" :fit="fit" :radius="10" />
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
                @on-switch="handleSwitch"
                @on-click="handleSwitch"
            ></ivue-image>
        </template>
        <h1>单独使用预览</h1>
        <ivue-button @click="handleShowPreview">打开图片预览</ivue-button>
        <ivue-image-preview v-model="preview" :preview-list="urlList"></ivue-image-preview>
        <h1>实例化调用</h1>
        <ivue-button @click="handleShowPreview1">打开图片预览</ivue-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            preview: false,
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
    mounted() {},
    methods: {
        handleSwitch(value) {
            console.log('handleSwitch', value);
        },
        handleShowPreview() {
            this.preview = true;
        },
        handleShowPreview1() {
            this.$IvueImagePreview.show({
                previewList: this.urlList,
                maskClosable: false
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
