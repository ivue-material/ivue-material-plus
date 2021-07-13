<template>
    <div>
        <ivue-steps :currentStep="current">
            <ivue-step title="已完成" content="这里是该步骤的描述信息"></ivue-step>
            <ivue-step title="进行中" content="这里是该步骤的描述信息"></ivue-step>
            <ivue-step title="待进行" content="这里是该步骤的描述信息"></ivue-step>
            <ivue-step title="待进行1" content="这里是该步骤的描述信息"></ivue-step>
        </ivue-steps>

        {{current}}

        <button @click="current  += 1">123123</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            current: 0,
            show: true,
            show1: true
        };
    },
};
</script>
