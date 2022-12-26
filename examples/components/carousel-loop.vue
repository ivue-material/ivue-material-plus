<template>
    <div class="content">
        <h1>基础用法</h1>
        <ivue-carousel-loop class="carousel-loop-demo" :autoplay="false" :dataList="urlList">
            <ivue-image
                v-for="(image, index) in urlList"
                style="width: 100px;"
                :src="image"
                fit="cover"
                :key="index"
            ></ivue-image>
        </ivue-carousel-loop>

        <ivue-carousel-loop class="red" :dataList="urlList">
            <div
                class="image"
                :style="{width:`${10 * index}px`}"
                v-for="(i, index) in urlList"
                :key="i"
            >
                <span>{{index}}</span>
                <img :src="i" />
            </div>
        </ivue-carousel-loop>

        <ivue-button @click="handleCLick">Add</ivue-button>
        {{urlList}}
        <h1>按钮位置</h1>
        <div>
            <p>hover</p>
            <ivue-carousel-loop arrow="hover">
                <div class="image" v-for="(i) in urlList" :key="i">
                    <img :src="i" />
                </div>
            </ivue-carousel-loop>

            <p>never</p>
            <ivue-carousel-loop arrow="never">
                <div class="image" v-for="(i) in urlList" :key="i">
                    <img :src="i" />
                </div>
            </ivue-carousel-loop>
            <p>outside</p>
            <ivue-carousel-loop arrow="outside">
                <div class="image" v-for="(i) in urlList" :key="i">
                    <img :src="i" />
                </div>
            </ivue-carousel-loop>
        </div>

        <h1>方向</h1>
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
        </ivue-carousel-loop>

        <h1>鼠标悬浮时不暂停自动切换</h1>
        <ivue-carousel-loop :pauseOnHover="false">
            <div class="image" v-for="(i, index) in urlList" :key="i">
                <span>{{index}}</span>
                <img :src="i" />
            </div>
        </ivue-carousel-loop>
        <h1>按钮点击是否等待动画完成后才可以下一步</h1>
        <ivue-carousel-loop :pauseOnHover="false">
            <div class="image" v-for="(i, index) in urlList" :key="i">
                <span>{{index}}</span>
                <img :src="i" />
            </div>
        </ivue-carousel-loop>
        <p>slidingEndNext false</p>
        <ivue-carousel-loop :slidingEndNext="false">
            <template #leftArrow>leftArrow</template>
            <template #rightArrow>rightArrow</template>
            <div class="image" v-for="(i, index) in urlList" :key="i">
                <span>{{index}}</span>
                <img :src="i" />
            </div>
        </ivue-carousel-loop>
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
    methods: {
        handleCLick() {
            this.urlList.push(
                'https://file.iviewui.com/images/image-demo-5.jpg'
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.carousel-loop-demo {
    width: 200px;
}

.image {
    width: 100px;
    height: 100px;

    img {
        width: 100%;
        height: 100%;
    }
}

.card {
    margin: 0 100px;
}

.content {
    width: 500px;
}
</style>
