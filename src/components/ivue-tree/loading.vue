<template>
  <div class="ivue-tree-node--loading__wrapper">
    <svg class="ivue-tree-node--loading" viewBox="25 25 50 50">
      <circle
        class="path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke-width="5"
        stroke-miterlimit="10"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ivue-tree-node--loading',
});
</script>
