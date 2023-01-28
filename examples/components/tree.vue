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
  <h2>可选择</h2>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    show-checkbox
    @on-check-change="handleCheck"
  ></ivue-tree>
  <p>checkBoxStrictly</p>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    show-checkbox
    checkBoxStrictly
    @on-check-change="handleCheck"
  ></ivue-tree>
  <p>node-key</p>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    node-key="id"
    :default-expanded-keys="[2, 3]"
    :default-checked-keys="[5]"
    show-checkbox
    @on-check-change="handleCheck"
  ></ivue-tree>
  <p>defaultExpandAll</p>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    show-checkbox
    defaultExpandAll
    @on-check-change="handleCheck"
  ></ivue-tree>
  <p>renderAfterExpand</p>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    :renderAfterExpand="false"
  ></ivue-tree>
  <h2>懒加载自定义叶子节点</h2>
  <ivue-tree :props="loadProps" :load="loadNode" lazy show-checkbox></ivue-tree>
</template>

<script lang="ts" setup>
const handleNodeClick = (data) => {
  console.log(data);
};

const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
];

const defaultProps = {
  children: 'children',
  label: 'label',
};

const handleCheck = (value) => {
  console.log(value);
};

const loadProps = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf',
};

const loadNode = (node, resolve) => {
  if (node.level === 0) {
    return resolve([{ name: 'region' }]);
  }
  if (node.level > 1) return resolve([]);

  setTimeout(() => {
    const data = [
      {
        name: 'leaf',
        leaf: true,
      },
      {
        name: 'zone',
      },
    ];

    resolve(data);
  }, 500);
};
</script>

<style lang="scss" scoped></style>
