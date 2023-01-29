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
    node-key="id"
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
  <ivue-tree :props="loadProps" :load="loadNode" lazy></ivue-tree>
  <h2>可选择</h2>
  <ivue-tree
    :props="loadProps"
    :load="loadNodeSelect"
    lazy
    show-checkbox
    @on-check-change="handleCheckChange"
  ></ivue-tree>
  <h2>禁用复选框</h2>
  <ivue-tree
    :data="disableData"
    :props="defaultProps"
    show-checkbox
  ></ivue-tree>
  <h2>树节点的选择</h2>
  <ivue-tree
    ref="treeRef"
    :data="data"
    show-checkbox
    default-expand-all
    node-key="id"
    highlight-current
    :props="defaultProps"
  ></ivue-tree>
  <div>
    <ivue-button @click="getCheckedNodes">getCheckedNodes</ivue-button>
    <ivue-button @click="getCheckedKeys">getCheckedKeys</ivue-button>
    <ivue-button @click="setCheckedNodes">setCheckedNodes</ivue-button>
    <ivue-button @click="setCheckedKeys">setCheckedKeys</ivue-button>
    <ivue-button @click="resetChecked">resetChecked</ivue-button>
    <ivue-button @click="updateKeyChildren">updateKeyChildren</ivue-button>
  </div>
  <h2>自定义节点内容</h2>
  <p>Using render-content</p>
  <ivue-tree
    :data="dataSource"
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    :render-content="renderContent"
  ></ivue-tree>
  <p>Using scoped slot</p>
  <ivue-tree
    :data="dataSource"
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <a @click="append(data)"> Append </a>
          <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a>
        </span>
      </span>
    </template>
  </ivue-tree>
  <h2>自定义节点类名</h2>
  <ivue-tree
    :data="data"
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    :props="{ class: 'red' }"
  ></ivue-tree>
  <h2>树节点过滤</h2>
  <ivue-input v-model="filterText" placeholder="Filter keyword"></ivue-input>

  <ivue-tree
    ref="treeReFilter"
    :data="data"
    :props="defaultProps"
    default-expand-all
    :filter-node-method="filterNode"
  ></ivue-tree>
  <h2>手风琴模式</h2>
  <ivue-tree :data="data" :props="defaultProps" accordion></ivue-tree>
  <h2>是否在点击节点的时候选中节点</h2>
  <ivue-tree
    :data="data"
    :props="defaultProps"
    show-checkbox
    @on-check-change="handleCheck"
    checkOnClickNode
  ></ivue-tree>
  <h2>可拖拽节点</h2>
  <ivue-tree
    :data="data"
    draggable
    default-expand-all
    node-key="id"
    @on-node-drag-start="handleDragStart"
  >
  </ivue-tree>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

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

const data1 = [
  {
    id: 20,
    label: '20',
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

let count = 1;
const loadNodeSelect = (node, resolve) => {
  if (node.level === 0) {
    return resolve([{ name: 'Root1' }, { name: 'Root2' }]);
  }
  if (node.level > 3) return resolve([]);

  setTimeout(() => {
    let data: any = [];
    data = [
      {
        name: `zone${count++}`,
      },
      {
        name: `zone${count++}`,
      },
    ];

    resolve(data);
  }, 500);
};

const handleCheckChange = (data, checked, indeterminate) => {
  console.log(data, checked, indeterminate);
};

const disableData = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 3,
        label: 'Level two 2-1',
        children: [
          {
            id: 4,
            label: 'Level three 3-1-1',
          },
          {
            id: 5,
            label: 'Level three 3-1-2',
            disabled: true,
          },
        ],
      },
      {
        id: 2,
        label: 'Level two 2-2',
        disabled: true,
        children: [
          {
            id: 6,
            label: 'Level three 3-2-1',
          },
          {
            id: 7,
            label: 'Level three 3-2-2',
            disabled: true,
          },
        ],
      },
    ],
  },
];

const treeRef = ref();
const getCheckedNodes = () => {
  console.log(treeRef.value!.getCheckedNodes(false, false));
};
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false));
};
const setCheckedNodes = () => {
  treeRef.value!.setCheckedNodes(
    [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 9,
        label: 'Level three 1-1-1',
      },
    ],
    false
  );
};
const setCheckedKeys = () => {
  treeRef.value!.setCheckedKeys([3], false);
};
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false);
};

const updateKeyChildren = () => {
  treeRef.value!.updateKeyChildren(1, data1);
};

const dataSource = ref([
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
]);
let id = 1000;

const renderContent = (
  h,
  {
    node,
    data,
    store,
  }: {
    node;
    data;
    store;
  }
) => {
  return h(
    'span',
    {
      class: 'custom-tree-node',
    },
    h('span', null, node.label),
    h(
      'span',
      null,
      h(
        'a',
        {
          onClick: () => append(data),
        },
        'Append '
      ),
      h(
        'a',
        {
          style: 'margin-left: 8px',
          onClick: () => remove(node, data),
        },
        'Delete'
      )
    )
  );
};

const append = (data) => {
  const newChild = { id: id++, label: 'testtest', children: [] };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  dataSource.value = [...dataSource.value];
};

const remove = (node, data) => {
  const parent = node.parent;
  const children = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.id === data.id);
  children.splice(index, 1);
  dataSource.value = [...dataSource.value];
};

const filterText = ref('');
const treeReFilter = ref();
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.includes(value);
};
watch(filterText, (val) => {
  treeReFilter.value!.filter(val);
});

const handleDragStart = (node, ev) => {
  console.log('drag start', node);
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
