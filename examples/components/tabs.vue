<template>
  <div>
    <!-- 基本用法 -->
    <p>基本用法 分页</p>
    <ivue-tabs v-model="tab" :height="100" :showArrows="false">
      <template #header>
        <ivue-tab v-for="n in 5" :key="`item${n}`" disabled>Item {{ n }}</ivue-tab>
      </template>

      <template #content>
        <ivue-tab-item v-for="i in 5" :key="i">{{ text }}{{ i }}</ivue-tab-item>
      </template>
    </ivue-tabs>
    <p>自适应宽度选项卡</p>
    <ivue-tabs autoWidth v-model="tab">
      <template #header>
        <ivue-tab v-for="n in 3" :key="`item${n}`" :name="`item${n}`"
          >Item {{ n }}</ivue-tab
        >
      </template>

      <template #content>
        <ivue-tab-item v-for="i in 3" :key="i">{{ text }}{{ i }}</ivue-tab-item>
      </template>
    </ivue-tabs>
    <p>固定选项卡</p>
    <ivue-tabs fixedWidth v-model="tab">
      <template #header>
        <ivue-tab v-for="n in 4" :key="`item${n}`" :name="`item${n}`"
          >Item {{ n }}</ivue-tab
        >
      </template>

      <template #content>
        <ivue-tab-item v-for="i in 4" :key="i">{{ text }}{{ i }}</ivue-tab-item>
      </template>
    </ivue-tabs>
    <p>标签右对齐</p>
    <ivue-tabs right v-model="tab">
      <template #header>
        <ivue-tab v-for="n in 3" :key="`item${n}`" :name="`item${n}`"
          >Item {{ n }}</ivue-tab
        >
      </template>

      <template #content>
        <ivue-tab-item v-for="i in 3" :key="i">{{ text }}{{ i }}</ivue-tab-item>
      </template>
    </ivue-tabs>
    <p>自定义图标</p>
    <ivue-tabs prevIcon="arrow_back" nextIcon="arrow_forward" v-model="tab">
      <template #header>
        <ivue-tab v-for="n in items" :key="`item${n}`" :name="`item${n}`"
          >Item {{ n }}</ivue-tab
        >
      </template>

      <template #content>
        <ivue-tab-item v-for="i in items" :key="i"
          >{{ text }}{{ i }}</ivue-tab-item
        >
      </template>
    </ivue-tabs>
    <ivue-button @click="add">add</ivue-button>
    <ivue-button @click="remove">remove</ivue-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,
      tab: 'item1',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    };
  },
  methods: {
    add() {
      this.items.push(this.items.length + 1);
    },
    remove() {
      this.items.splice(this.items.length - 1, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.contnet {
  width: 500px;
}
</style>
