<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  provide,
  onMounted,
  watch,
  ref,
  unref,
} from 'vue';

// type
import { CollapseContextKey } from '@ivue-material-plus/tokens';

// collapse
import { collapseProps } from './collapse';

// type
import type { PanelProxyInstance } from './panel';

const prefixCls = 'ivue-collapse';

export default defineComponent({
  name: prefixCls,
  emits: ['update:modelValue', 'on-change'],
  props: collapseProps,
  setup(props, { emit }) {
    // data

    // 当前值
    const currentValue = ref<string | string[]>(props.modelValue);

    // 子级列表
    const childrenList = ref<PanelProxyInstance[]>([]);

    // computed

    // 外层样式
    const classes = computed(() => {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-simple`]: props.simple,
        },
      ];
    });

    // methods

    // 设置激活的面板
    const setActive = () => {
      const activeKey = getActiveKey();

      unref(childrenList).forEach((item, index: number) => {
        // 子项名称
        const name = item.name || index.toString();

        // 激活子面板
        item.isActive = activeKey.indexOf(name) > -1;
        item.index = index;
      });
    };

    // 获取激活的key
    const getActiveKey = () => {
      // 获取初始化需要激活的面板
      let activeKey = unref(currentValue) || [];

      // 是否开启手风琴效果
      const accordion = props.accordion;

      // 判断是否是数组
      if (!Array.isArray(activeKey)) {
        activeKey = [activeKey];
      }

      // 手风琴效果
      if (accordion && activeKey.length > 1) {
        activeKey = [activeKey[0]];
      }

      for (let i = 0; i < activeKey.length; i++) {
        // 把value字符串化
        activeKey[i] = activeKey[i].toString();
      }

      return activeKey;
    };

    // 插入扩展
    const pushExpandable = (child: PanelProxyInstance) => {
      const expandableListItems = unref(childrenList);

      // 寻找是否已经有了选项
      const findItem = expandableListItems.find((target) => {
        return target.uid === child.uid;
      });

      if (!findItem) {
        childrenList.value = expandableListItems.concat([child as any]);
      }
    };

    // 删除扩展
    const removeExpandable = (child: PanelProxyInstance) => {
      const expandableListItems = unref(childrenList);

      // 寻找是否已经有了选项
      const findItem = expandableListItems.find((target) => {
        return target.uid === child.uid;
      });

      if (findItem) {
        childrenList.value = expandableListItems.filter(
          (target) => target.uid !== child.uid
        );
      }
    };

    // 子项点击切换
    const toggle = (obj: { name: string; isActive: boolean }) => {
      const name = obj.name.toString();

      let newActiveKey = [];

      // 是否开启手风琴效果
      const accordion = props.accordion;

      // 手风琴效果
      if (accordion) {
        if (!obj.isActive) {
          newActiveKey.push(name);
        }
      }
      // 普通效果
      else {
        // 获取当前需要激活的面板
        const activeKey = getActiveKey();

        // 面板的 index
        const nameIndex = activeKey.indexOf(name);

        // 是否已经激活
        if (obj.isActive) {
          if (nameIndex > -1) {
            activeKey.splice(nameIndex, 1);
          }
        } else {
          if (nameIndex < 0) {
            activeKey.push(name);
          }
        }

        newActiveKey = activeKey;
      }

      // 重新设置当前激活的面板
      currentValue.value = newActiveKey;

      // 设置激活
      setActive();

      // 设置 v-model
      emit('update:modelValue', newActiveKey);

      // 切换面板是触发，返回当前展开的面板的 key，格式为数组
      emit('on-change', newActiveKey);
    };

    // watch

    // 监听 v-modal
    watch(
      () => props.modelValue,
      (value) => {
        currentValue.value = value;
      }
    );

    // 监听当前值
    watch(
      () => unref(currentValue),
      () => {
        setActive();
      }
    );

    // provide
    provide(CollapseContextKey, {
      pushExpandable,
      removeExpandable,
      toggle,
    });

    // onMounted
    onMounted(() => {
      setActive();
    });

    return {
      // computed
      classes,
    };
  },
});
</script>
