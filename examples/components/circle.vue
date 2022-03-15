<template>
    <div>
        <h1>基础用法</h1>
        <div>
            <ivue-circular :percent="80" >
                <span class="demo-Circle-inner" style="font-size:24px">80%</span>
            </ivue-circular>

            <ivue-circular :percent="100" stroke-color="#27E2B2" >
                <ivue-icon>add</ivue-icon>
            </ivue-circular>

            <ivue-circular :percent="35" stroke-color="#FF617F">
                <ivue-icon>add</ivue-icon>
            </ivue-circular>
        </div>
        <h1>配合外部组件使用</h1>
        <div>
            <ivue-circular :percent="percent" :stroke-color="color">
                <span style="font-size:24px">{{ percent }}%</span>
            </ivue-circular>

            <button icon="ios-add" @click="add">1</button>
            <button icon="ios-remove" @click="minus">2</button>
        </div>
        <h1>自定义更多样式</h1>
        <div>
            <ivue-circular
                :size="250"
                :trail-width="4"
                :stroke-width="5"
                :percent="75"
                stroke-linecap="square"
                stroke-color="#43a3fb"
            >
                <div class="demo-Circle-custom">
                    <h1>42,001,776</h1>
                    <p>消费人群规模</p>
                    <span>
                        总占人数
                        <i>75%</i>
                    </span>
                </div>
            </ivue-circular>
        </div>
        <h1>仪表盘</h1>
        <div>
            <ivue-circular :percent="80" dashboard>
                <span class="demo-circle-inner" style="font-size:24px">80%</span>
            </ivue-circular>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            percent: 0,
        };
    },
    computed: {
        color() {
            let color = '#2db7f5';
            if (this.percent == 100) {
                color = '#5cb85c';
            }
            return color;
        },
    },
    methods: {
        add() {
            if (this.percent >= 100) {
                return false;
            }
            this.percent += 10;
        },
        minus() {
            if (this.percent <= 0) {
                return false;
            }
            this.percent -= 10;
        },
    },
};
</script>

<style lang="scss">
.demo-Circle-custom {
    & h1 {
        color: #3f414d;
        font-size: 28px;
        font-weight: normal;
    }
    & p {
        color: #657180;
        font-size: 14px;
        margin: 10px 0 15px;
    }
    & span {
        display: block;
        padding-top: 15px;
        color: #657180;
        font-size: 14px;
        &:before {
            content: '';
            display: block;
            width: 50px;
            height: 1px;
            margin: 0 auto;
            background: #e0e3e6;
            position: relative;
            top: -15px;
        }
    }
    & span i {
        font-style: normal;
        color: #3f414d;
    }
}
</style>
