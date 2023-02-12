<template>
  <ul :class="[`${prefixCls}-wrap`]" v-show="visible">
    <!-- 标题 -->
    <li :class="[`${prefixCls}-title`]">{{ label }}</li>
    <!-- 选项 -->
    <ul>
      <li :class="[`${prefixCls}`]" ref="list">
        <slot></slot>
      </li>
    </ul>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  reactive,
  toRefs,
  inject,
  ref,
  nextTick,
} from 'vue';

// option-group
import { optionGroupProps } from './option-group';
// tokens
import {
  SelectContext,
  SelectContextKey,
  SelectGroupContextKey,
} from '@ivue-material-plus/tokens';

const prefixCls = 'ivue-select-group';

export default defineComponent({
  name: 'ivue-option-group',
  props: optionGroupProps,
  setup(props) {
    // inject
    const select = inject(SelectContextKey) as SelectContext;

    // dom
    const list = ref<HTMLElement>();

    // 显示
    const visible = ref<boolean>(true);

    // methods

    // 筛选过滤
    const queryChange = () => {
      if (select.props.filterable) {
        if (select.props.filterableHiddenGroup) {
          setTimeout(() => {
            const children = list.value!.children;

            visible.value = [...children].some((option) => {
              const visible = (option as HTMLElement).dataset.visible;
              const _select = (option as HTMLElement).dataset.select;

              // 是否是选项组件
              if (_select) {
                // 当前选项是否显示
                return !!(visible === 'true');
              }
            });
          });
        } else {
          nextTick(() => {
            visible.value = select.options.some((option) => {
              return option.data.visible === true;
            });
          });
        }
      }
    };

    // provide
    provide(
      SelectGroupContextKey,
      reactive({
        ...toRefs(props),
      })
    );

    // 发送筛选过滤事件
    select.selectEmitter.on('ivueOptionGroupQueryChange', queryChange);

    return {
      prefixCls,

      // dom
      list,

      // ref
      visible,
    };
  },
});
</script>
