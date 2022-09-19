<template>
    <div class="card">
        <h1>区域加载</h1>
        <div class="conetn1" v-loading="show"></div>
        <h1>自定义</h1>
        <div
            class="conetn1"
            v-loading="show"
            ivue-loading-text="拼命加载中"
            ivue-loading-icon-class="ivue-icon red"
            ivue-loading-icon-text="nightlight_round"
        ></div>
        <button @click="show = !show">show</button>
        <h1>整页加载</h1>
        <div>
            <ivue-button
                :color="['#5AB2FF', '#5B8EFF']"
                @click="openFullScreen1"
                v-loading.fullscreen.lock="fullscreenLoading"
            >指令方式</ivue-button>
            <ivue-button
                :color="['#5AB2FF', '#5B8EFF']"
                @click="openFullScreen2"
            >服务方式</ivue-button>
        </div>
    </div>
</template>

<script>
import { h, render } from 'vue';

export default {
    data() {
        return {
            fullscreenLoading: false,
            show: true,
        };
    },
    methods: {
        openFullScreen1() {
            this.fullscreenLoading = true;

            setTimeout(() => {
                this.fullscreenLoading = false;
            }, 2000);
        },
        openFullScreen2() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                loadingSpinner: this.renderIcon
            });
            setTimeout(() => {
                loading.close();
            }, 2000);
        },
        renderIcon() {
            return h('ivue-icon', {}, ['menu']);
        },
    },
};
</script>

<style lang="scss">
.card{
    height: 10000px;
}
.conetn1 {
    height: 100px;
    width: 100px;
    background: yellow;
}

.ivue-icon {
    font-family: 'Material Icons';
}

.circular1 {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    margin: auto;
}
@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
    }

    to {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}

@keyframes color {
    0%,
    to {
        stroke: #d62d20;
    }

    40% {
        stroke: #0057e7;
    }

    66% {
        stroke: #008744;
    }

    80%,
    90% {
        stroke: #ffa700;
    }
}

.path1 {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-width: 3;
    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    stroke-linecap: round;
}
</style>
