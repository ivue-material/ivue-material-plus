<template>
    <div>
        <h1>基本用法</h1>
        <p>
            自定义标题、额外操作和主体内容，可以完全自由控制各个部分，也可以结合其它组件一起使用，较为灵活。
            可以通过设置属性 title 快速设置标题栏。
        </p>
        <ivue-card style="width:100%" :padding="50" :radius="10">
            <template #title>title</template>
            <template #extra>extra</template>
            212112
            <!-- <p class="rate-demo" v-for="item in randomMovieList">
                <a :href="item.url" target="_blank">{{ item.name }}</a>
                <span>
                    <Rate disabled v-model="item.rate" />
                    {{ item.rate }}
                </span>
            </p>-->
        </ivue-card>
        <p>标题</p>
        <ivue-card style="width:100%" title="标题">
            212112
            <!-- <p class="rate-demo" v-for="item in randomMovieList">
                <a :href="item.url" target="_blank">{{ item.name }}</a>
                <span>
                    <Rate disabled v-model="item.rate" />
                    {{ item.rate }}
                </span>
            </p>-->
        </ivue-card>
        <h1>无边框</h1>
        <p>通过设置属性bordered为 false ，可以不添加边框，建议在灰色背景下使用</p>
        <div style="background:#eee;padding: 20px">
            <ivue-card :border="false" shadow>
                <template #title>No border title</template>
                <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type.</p>
            </ivue-card>
        </div>
        <h1>禁用悬停阴影</h1>
        <p>通过设置属性dis-hover来禁用鼠标悬停显示阴影的效果</p>
        <ivue-card disHover>
            <template #title>No border title</template>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type.</p>
        </ivue-card>
        <h1>简洁卡片</h1>
        <ivue-card padding="1rem" to="/count-down">
            <div style="text-align:center">
                <h3>A high quality UI Toolkit based on Vue.js</h3>
            </div>
        </ivue-card>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
