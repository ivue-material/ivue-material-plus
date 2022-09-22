<template>
    <div>
        <p>基础用法</p>
        <ivue-carousel height="auto" :initialIndex="1" ref="carousel">
            <ivue-carousel-item name="1" label="1">
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item name="2" label="2">
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item name="3" label="3">
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <ivue-button @click="handlePrev">上一个</ivue-button>
        <ivue-button @click="handleNext">下一个</ivue-button>

        <h1>指示器的触发方式</h1>
        <p>hover</p>
        <ivue-carousel trigger="hover" height="300px">
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <p>默认click</p>
        <ivue-carousel>
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <h1>切换箭头显示时机</h1>
        <p>always</p>
        <ivue-carousel arrow="always">
            <template #leftArrow>
                <span>左箭头</span>
            </template>
            <template #rightArrow>
                <span>右箭头</span>
            </template>

            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <p>hover</p>
        <ivue-carousel arrow="hover">
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <p>never</p>
        <ivue-carousel arrow="never">
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <h1>指示器的位置，可选值为 inside （内部），outside（外部），none（不显示）</h1>
        <p>outside</p>
        <ivue-carousel dots="outside">
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <p>inside</p>
        <ivue-carousel dots="inside">
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <p>none</p>
        <ivue-carousel dots="none">
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <h1>是否显示圆形指示器</h1>
        <ivue-carousel radiusDot>
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <h1>展示的方向</h1>
        <ivue-carousel direction="vertical">
            <ivue-carousel-item>
                <div class="demo-carousel" @click="handleClick">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <h1>是否自动切换</h1>
        <ivue-carousel direction="vertical" autoplay :interval="1000">
            <ivue-carousel-item>
                <div class="demo-carousel" @click="handleClick">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <ivue-carousel autoplay :interval="1000">
            <ivue-carousel-item>
                <div class="demo-carousel" @click="handleClick">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">3</div>
            </ivue-carousel-item>
        </ivue-carousel>
        <h1>卡片化</h1>
        <div style="width:300px">
            <ivue-carousel type="card" direction="vertical" height="auto">
                <ivue-carousel-item>
                    <div class="demo-carousel">1</div>
                </ivue-carousel-item>
                <ivue-carousel-item>
                    <div class="demo-carousel">2</div>
                </ivue-carousel-item>
                <ivue-carousel-item>
                    <div class="demo-carousel">3</div>
                </ivue-carousel-item>
            </ivue-carousel>
        </div>
        <h1>卡片化</h1>
        <ivue-carousel type="card" height="auto">
            <ivue-carousel-item>
                <div class="demo-carousel">1</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">2</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel three">3</div>
            </ivue-carousel-item>
            <ivue-carousel-item>
                <div class="demo-carousel">4</div>
            </ivue-carousel-item>
        </ivue-carousel>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    mounted() {
        setTimeout(() => {
            this.$refs.carousel.setActiveItem(2);
        }, 2000);
    },
    methods: {
        handleClick() {
            console.log(12);
        },
        handlePrev() {
            this.$refs.carousel.prev();
        },
        handleNext() {
            this.$refs.carousel.next();
        },
    },
};
</script>

<style lang="scss">
.demo-carousel {
    height: 200px;
    line-height: 100px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.three {
    background: red;
}

.ivue-carousel-item:nth-child(2n) {
    background-color: #99a9bf;
}

.ivue-carousel-item:nth-child(2n + 1) {
    background-color: #d3dce6;
}


</style>
