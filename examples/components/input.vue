<template>
    <div>
        <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
        />

        <p>
            基本用法，可以使用 v-model 实现数据的双向绑定。可以直接设置 style
            来改变输入框的宽度，默认 100%。
        </p>
        <ivue-input>
            <template #prepend>http://</template>
        </ivue-input>
        <p>{{ baseInput }}</p>
    </div>
</template>

<script>

export default {
    data () {
        return {
            baseInput: '',
            clearableInput: ''
        }
    },
    methods: {
        enter (event) {
            console.log(event)
        },
        clickVisiblity () {
            console.log('?111?')
        }
    }
}
</script>

<style>
</style>
