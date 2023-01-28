<template>
  <h1>基础用法</h1>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    @node-click="handleNodeClick"
  ></ivue-tree>
  <h2>手风琴模式</h2>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    accordion
    @node-click="handleNodeClick"
  ></ivue-tree>
</template>

<script lang="ts" setup>
const handleNodeClick = (data) => {
  console.log(data);
};

const data = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
];

const defaultProps = {
  children: 'children',
  label: 'label',
};
</script>

<style lang="scss" scoped></style>
