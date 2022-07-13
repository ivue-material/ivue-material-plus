<template>
    <div>
        <h1>基础用法</h1>
        <ivue-spin></ivue-spin>
        <button @click="show = !show">show</button>

        <ivue-spin size="100" :show="show"></ivue-spin>

        <h1>居中固定</h1>
        <div class="fix">
            <ivue-spin fix></ivue-spin>
        </div>
        <div class="fix">
            <ivue-spin fix>loading</ivue-spin>
        </div>
        <h1>自定义内容</h1>
        <div class="demo-spin-col">
            <ivue-spin fix>加载中...</ivue-spin>
        </div>
        <div class="demo-spin-col">
            <ivue-spin fix>
                <ivue-icon class="demo-spin-icon-load">donut_large</ivue-icon>
                <div>Loading</div>
            </ivue-spin>
        </div>
        <div class="demo-spin-col">
            <ivue-spin fix>
                <div class="loader">
                    <svg class="circular" viewBox="25 25 50 50">
                        <circle
                            class="path"
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            stroke-width="5"
                            stroke-miterlimit="10"
                        />
                    </svg>
                </div>
            </ivue-spin>
        </div>
        <h1>整页加载</h1>
        <ivue-button @click="handleSpinShow">整页显示，3秒后关闭</ivue-button>
        <ivue-button @click="handleSpinCustom">自定义显示内容</ivue-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
        };
    },
    methods: {
        handleSpinShow() {
            this.$IvueSpin.show();
            setTimeout(() => {
                this.$IvueSpin.hide();
            }, 3000);
        },
        handleSpinCustom() {
            this.$IvueSpin.show({
                render: (h) => {
                    return h('div', [h('div', 'Loading')]);
                },
            });

            setTimeout(() => {
                this.$IvueSpin.hide();
            }, 3000);
        },
    },
};
</script>

<style lang="scss" scoped>
.fix {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px solid #000;
}

.demo-spin-container {
    display: inline-block;
    width: 200px;
    height: 100px;
    position: relative;
    border: 1px solid #000;
}

.demo-spin-col {
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}

.loader {
    width: 30px;
    height: 30px;
    position: relative;
    margin: 0 auto;
}

.circular {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
.path {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    stroke-linecap: round;
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
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
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}

@keyframes color {
    0%,
    100% {
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

@keyframes ani-demo-spin {
    from {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(180deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
