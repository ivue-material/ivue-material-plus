<template>
  <h1>基础用法</h1>
  <ivue-skeleton></ivue-skeleton>
  <h1>段落设置 对象</h1>
  <ivue-skeleton
    :paragraph="{ rows: 5, width: [100] }"
  ></ivue-skeleton>
  <h1>段落设置 数字</h1>
  <ivue-skeleton :paragraph="10"></ivue-skeleton>
  <h1>圆形</h1>
  <ivue-skeleton-item type="circle"></ivue-skeleton-item>
  <h1>正方形</h1>
  <ivue-skeleton-item type="square"></ivue-skeleton-item>
  <h1>rect</h1>
  <ivue-skeleton-item type="rect"></ivue-skeleton-item>
  <h1>image</h1>
  <ivue-skeleton-item type="image"></ivue-skeleton-item>
  <h1>h1</h1>
  <ivue-skeleton-item type="h1"></ivue-skeleton-item>
  <h1>h3</h1>
  <ivue-skeleton-item type="h3"></ivue-skeleton-item>
  <h1>caption</h1>
  <ivue-skeleton-item type="caption"></ivue-skeleton-item>
  <h1>p</h1>
  <ivue-skeleton-item type="p"></ivue-skeleton-item>
  <h1>button</h1>
  <ivue-skeleton-item type="button"></ivue-skeleton-item>
  <h1>动画效果 animated</h1>
  <ivue-skeleton animated></ivue-skeleton>
  <h1>自定义样式</h1>
  <ivue-skeleton>
    <template #template>
      <ivue-skeleton-item type="circle"></ivue-skeleton-item>
      <ivue-skeleton-item type="square"></ivue-skeleton-item>
      <ivue-skeleton-item type="rect"></ivue-skeleton-item>
      <ivue-skeleton-item type="image"></ivue-skeleton-item>
      <ivue-skeleton-item type="h1"></ivue-skeleton-item>
      <ivue-skeleton-item type="h3"></ivue-skeleton-item>
      <ivue-skeleton-item type="caption"></ivue-skeleton-item>
      <ivue-skeleton-item type="p"></ivue-skeleton-item>
      <ivue-skeleton-item type="button"></ivue-skeleton-item>
    </template>
  </ivue-skeleton>
  <h1>加载状态 total 控制渲染多是个假数据</h1>
  <ivue-switch v-model="loading1"></ivue-switch>
  <ivue-skeleton style="width: 240px" :loading="loading1" animated :total="2">
    <template #template>
      <ivue-skeleton-item
        type="image"
        style="width: 240px; height: 240px; font-size: 80px"
      />
      <div style="padding: 14px 0">
        <ivue-skeleton-item variant="h3" style="width: 50%" />
        <ivue-skeleton-item variant="text" style="margin-right: 16px" />
      </div>
    </template>
    <template #default>
      <div>
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
          style="width: 240px; height: 240px"
        />
      </div>
      <div style="padding: 14px 0; line-height: 16px">
        <p>Delicious hamburger</p>
        <p>{{ currentDate }}</p>
      </div>
    </template>
  </ivue-skeleton>
  <h1>防止渲染抖动 throttle</h1>
  <ivue-switch v-model="loading2"></ivue-switch>
  <ivue-skeleton
    style="width: 240px"
    :loading="loading2"
    animated
    :throttle="500"
  >
    <template #template>
      <ivue-skeleton-item
        type="image"
        style="width: 240px; height: 240px; font-size: 80px"
      />
      <div style="padding: 14px 0">
        <ivue-skeleton-item variant="h3" style="width: 50%" />
        <ivue-skeleton-item variant="text" style="margin-right: 16px" />
      </div>
    </template>
    <template #default>
      <div>
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
          style="width: 240px; height: 240px"
        />
      </div>
      <div style="padding: 14px 0; line-height: 16px">
        <p>Delicious hamburger</p>
        <p>{{ currentDate }}</p>
      </div>
    </template>
  </ivue-skeleton>
</template>

<script setup>
import { ref } from 'vue';

const loading1 = ref(true);
const loading2 = ref(true);
const currentDate = new Date().toDateString();
</script>

<style lang="scss" scoped></style>
