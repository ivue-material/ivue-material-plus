<template>
    <svg class="ivue-table-circular" viewBox="25 25 50 50">
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
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ivue-table-loading',
});
</script>
