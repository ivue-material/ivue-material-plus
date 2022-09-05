<template>
    <div>
        <h1>基本用法</h1>
        <p>
            自定义标题、额外操作和主体内容，可以完全自由控制各个部分，也可以结合其它组件一起使用，较为灵活。
            可以通过设置属性 title 和 icon 快速设置标题栏。
        </p>
        <ivue-card style="width:100%">
            <template #title>
              title
            </template>
            <template #extra>
              extra
            </template>

            212112
            <!-- <p class="rate-demo" v-for="item in randomMovieList">
                <a :href="item.url" target="_blank">{{ item.name }}</a>
                <span>
                    <Rate disabled v-model="item.rate" />
                    {{ item.rate }}
                </span>
            </p> -->
        </ivue-card>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
