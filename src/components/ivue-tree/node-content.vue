<script lang="ts">
import { defineComponent, h, inject } from 'vue';

// type
import Node from './store/node';
import { TreeNodeContextKey } from './types/node';
import { TreeContextKey } from './types/tree';
import type { Props } from './types/node';

const prefixCls = 'ivue-tree-node--label';

export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * tree 节点对象
     *
     * @type {Node}
     */
    node: {
      type: Node,
      required: true,
      default: () => ({}),
    },
    /**
     * 树节点的内容区的渲染方法
     *
     * @type {Function}
     */
    renderContent: {
      type: Function,
    },
  },
  setup(props: Props) {
    const treeNode = inject(TreeNodeContextKey);
    const tree = inject(TreeContextKey);

    return () => {
      const node = props.node;

      // tree 节点数据对象 ｜ tree 存储数据对象
      const { data, store } = node;

      // 树节点的内容区的渲染方法
      if (props.renderContent) {
        return props.renderContent(h, { _self: treeNode, node, data, store });
      }

      if (tree.ctx.slots.default) {
        return tree.ctx.slots.default({ node, data });
      }

      return h(
        'span',
        {
          class: prefixCls,
        },
        [node.label]
      );
    };
  },
});
</script>
