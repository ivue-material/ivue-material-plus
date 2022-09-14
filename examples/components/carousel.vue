<template>
    <div>
        <p>基础用法</p>
        <ivue-carousel height="auto" :initialIndex="1">
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
        <ivue-carousel type="card" direction="vertical">
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
        <h1>卡片化</h1>

    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        handleClick() {
            console.log(12);
        },
    },
};
</script>

<style lang="scss">
.demo-carousel {
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #fff;
    font-size: 20px;
}

.ivue-carousel-item:nth-child(2n) {
    background-color: #99a9bf;
}

.ivue-carousel-item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>
