<template>
    <div>
        <h1>基本用法</h1>
        <div>
            <ivue-progress :percent="45" indeterminate></ivue-progress>

            <ivue-progress
                :percent="25"
                :strokeColor="['#5AB2FF', '#5B8EFF']"
                boxShadowColor="#5B8EFF"
            ></ivue-progress>
            <ivue-progress :percent="45" status="active"></ivue-progress>
            <ivue-progress :percent="25" status="wrong"></ivue-progress>
            <ivue-progress :percent="25" status="warning"></ivue-progress>
            <ivue-progress :percent="100"></ivue-progress>
            <ivue-progress :percent="25" hide-info></ivue-progress>
        </div>

        <h1>动画进度条</h1>
        <div>
            <ivue-progress :percent="45" indeterminate></ivue-progress>
            <ivue-progress :percent="100" indeterminate :duration="5"></ivue-progress>

            <ivue-progress
                indeterminate
                :duration="10"
                :percent="25"
                :strokeColor="['#5AB2FF', '#5B8EFF']"
                boxShadowColor="#5B8EFF"
            ></ivue-progress>
        </div>

        <h1>百分比内显</h1>
        <div>
            <ivue-progress :percent="25" :stroke-width="20" text-inside></ivue-progress>
            <ivue-progress :percent="45" :stroke-width="20" status="active" text-inside></ivue-progress>
            <ivue-progress :percent="65" :stroke-width="20" status="wrong" text-inside></ivue-progress>
            <ivue-progress :percent="25" :stroke-width="20" status="warning" text-inside></ivue-progress>
            <ivue-progress :percent="100" :stroke-width="20" text-inside></ivue-progress>
        </div>

        <h1>垂直方向</h1>
        <div class="content">
            <ivue-progress :percent="50" vertical></ivue-progress>
            <ivue-progress :percent="45" status="active" vertical></ivue-progress>
            <ivue-progress :percent="25" status="wrong" vertical></ivue-progress>
            <ivue-progress :percent="25" status="warning" vertical></ivue-progress>
            <ivue-progress :percent="100" vertical></ivue-progress>
            <ivue-progress :percent="25" hide-info vertical></ivue-progress>
        </div>
        <h1>配合外部组件使用</h1>
        <div>
            <ivue-progress :percent="percent"></ivue-progress>

            <button icon="ios-add" @click="add">1</button>
            <button icon="ios-remove" @click="minus">2</button>
        </div>

        <h1>自定义更多样式</h1>
        <div>
            <ivue-progress :percent="25" :stroke-width="5"></ivue-progress>
            <ivue-progress :percent="100">
                <span>成功</span>
            </ivue-progress>
        </div>
        <h1>渐变色</h1>
        <div>
            <ivue-progress :strokeColor="['#5AB2FF', '#5B8EFF']" :percent="90"></ivue-progress>
        </div>

        <h1>分段进度条</h1>
        <div>
            <ivue-progress :percent="60" :success-percent="30"></ivue-progress>
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

<style lang="scss" scoped>
.content {
    display: flex;
}
</style>
