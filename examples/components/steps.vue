<template>
    <div>
        <h1>基本用法，组件会根据current自动判断各步骤状态。</h1>
        <div class="content">
            <ivue-steps :currentStep="1">
                <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
        </div>
        <h1>带图标的步骤</h1>

        <div class="content">
            <ivue-steps :currentStep="2">
                <ivue-step title="已完成" content="这里是该步骤的描述信息" icon="account_circle"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息" icon="pets"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息" icon="verified"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息" icon="savings"></ivue-step>
            </ivue-steps>
        </div>

        <h1>点击下一步按钮可以切换当前进度状态</h1>
        <p>当前正在进行第 {{ current + 1 }} 步</p>

        <div class="content">
            <ivue-steps :currentStep="current">
                <ivue-step title="已完成" content="这里是该步骤的描述信息" icon></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
            <ivue-button @click="next">Next step</ivue-button>
        </div>

        <h1>步骤运行错误 设置Steps的属性status为error指定当前步骤状态。</h1>
        <p>当前步骤的状态，可选值为 wait、process、finish、error</p>
        <div class="content">
            <ivue-steps :currentStep="1" status="error">
                <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
        </div>

        <h1>设置属性direction为vertical在垂直方向展示。</h1>
        <div class="content">
            <ivue-steps :currentStep="current" direction="vertical">
                <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
        </div>
        <h1>每个 step 的间距，不填写将自适应间距。支持百分比。</h1>
        <div class="content">
            <ivue-steps :currentStep="current" :space="100">
                <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>

            <ivue-steps :currentStep="current" direction="vertical" :space="100">
                <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
        </div>

        <h1>进行居中对齐</h1>
        <div class="content">
            <p>文字左居中</p>
            <ivue-steps :currentStep="current" alignCenter>
                <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
            <p>文字底部居中</p>
            <ivue-steps :currentStep="current" alignCenter textDirection="bottom">
                <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
        </div>

        <h1>插槽</h1>
        <div class="content">
            <ivue-steps :currentStep="current" alignCenter>
                <ivue-step title="已完成">
                    <template #title>插槽标题</template>
                    <h1 class="slot">
                        插槽内容这里是该步骤的描述信息
                    </h1>
                </ivue-step>
                <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
                <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
            </ivue-steps>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            current: 0,
            show: true,
            show1: true,
        };
    },
    methods: {
        next() {
            console.log(this.current);
            if (this.current === 4) {
                this.current = 0;
            } else {
                this.current += 1;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    margin: 30px 0;
}

.slot{
    font-size: 12px;
}
</style>
