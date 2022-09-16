<template>
    <div>
        <h1>基础用法</h1>
        <ivue-carousel-loop>
            <div class="image" v-for="(i, index) in urlList" :key="i">
                <span>{{index}}</span>
                <img :src="i" />
            </div>
        </ivue-carousel-loop>

        <!-- <h1>方向</h1>
        <ivue-carousel-loop direction="left">
            <div class="image" v-for="(i, index) in urlList" :key="i">
                <span>{{index}}</span>
                <img :src="i" />
            </div>
        </ivue-carousel-loop>
        <ivue-carousel-loop direction="right">
            <div class="image" v-for="(i, index) in urlList" :key="i">
                <span>{{index}}</span>
                <img :src="i" />
            </div>
        </ivue-carousel-loop> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
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
.image {
    width: 100px;
    height: 100px;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>
