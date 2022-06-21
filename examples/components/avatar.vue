<template>
    <div>
        <h1>基础用法</h1>
        <ivue-avatar>基础用法</ivue-avatar>
        <ivue-avatar shape="square">基础用法</ivue-avatar>
        <h1>类型</h1>
        <ivue-avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"></ivue-avatar>
        <ivue-avatar icon="brightness_5"></ivue-avatar>
        <ivue-avatar>
            <template #icon>11212</template>
        </ivue-avatar>

        <ivue-avatar>121</ivue-avatar>
        <ivue-avatar color="red">121</ivue-avatar>
        <ivue-avatar color="#000">121</ivue-avatar>
        <h1>大小</h1>
         <ivue-input v-model="input" placeholder="请输入大小"></ivue-input>
        <ivue-avatar >121</ivue-avatar>
        <ivue-avatar :size="input">121</ivue-avatar>
        <ivue-avatar size="20px">121</ivue-avatar>

    </div>
</template>

<script>
export default {
    data () {
        return {
            input: 40
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
