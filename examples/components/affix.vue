<template>
  <!-- <div class="scroll" ref="dom">
    <div class="background">
      <ivue-affix :target="dom" :offsetBottom="10" ref="affixRef">
        <div class="style">固定在最顶部</div>
      </ivue-affix>
    </div>
  </div> -->
  <ivue-affix :offset-bottom="20" @on-change="handleChange">
    <div class="demo-affix">固定在最底部</div>
  </ivue-affix>
  <div style="height: 100vh"></div>
</template>

<script setup>
import { onMounted, ref, h } from 'vue';

const dom = ref();
const affixRef = ref();

const handleChange = (active) => {
  console.log(active);
};
</script>

<style lang="scss" scope>
.affix {
  width: 100px;
  height: 3000px;
  background: red;
}

.scroll {
  position: relative;

  height: 100px;
  overflow: scroll;
}

.background {
  padding-top: 260px;
  height: 300px;
  background: #27e2b2;
}

.demo-affix {
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 12px;
  border-radius: 5px;
  background: rgba(0, 153, 229, 0.7);
  color: #fff;
}

.style {
  width: 250px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 12px;
  border-radius: 5px;
  background: #5b8eff;
  color: #fff;
}
</style>
