<template>
  <div :class="wrapperClass" :style="wrapperStyles">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  inject,
  nextTick,
  getCurrentInstance,
  onBeforeUnmount,
  unref,
  ref,
  shallowRef,
} from 'vue';
import {
  transferIndex,
  transferIncrease,
  getStyle,
} from '@ivue-material-plus/utils';
import { useNamespace } from '@ivue-material-plus/hooks';

// createPopper
import { createPopper } from '@popperjs/core';
// drop-down
import { dropDownProps } from './drop-down';
// tokens
import { SelectContextKey } from '@ivue-material-plus/tokens';

// type
import type { ComponentInternalInstance } from 'vue';
import type { Instance } from '@popperjs/core';

const prefixCls = 'ivue-select-dropdown';

export default defineComponent({
  name: prefixCls,
  props: dropDownProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // inject
    const select = inject(SelectContextKey);

    // vm
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    // 获取Index
    const handleGetIndex = () => {
      transferIncrease();
      return transferIndex;
    };

    // 当前zIndex
    const tIndex = ref<number>(handleGetIndex());
    // popper状态
    const popperStatus = ref<boolean>(false);
    // popper
    const popper = shallowRef<Instance | undefined>();

    // computed

    // wrapperClass
    const wrapperClass = computed(() => {
      return [bem.b(), props.className];
    });

    // wrapperStyles
    const wrapperStyles = computed(() => {
      // 是否将弹层放置于 body 内
      if (props.transfer) {
        return {
          minWidth: unref(minWidth),
          zIndex: 1060 + unref(tIndex),
        };
      }

      return {
        minWidth: unref(minWidth),
      };
    });

    // 最小宽度
    const minWidth = computed(() => {
      return select && `${getStyle(select.selectWrapper, 'width')}`;
    });

    // methods

    // 更新数据
    const update = () => {
      nextTick(() => {
        // 是否已经注册了 popper
        if (unref(popper)) {
          unref(popper)?.update();

          // popper状态
          popperStatus.value = true;
        } else {
          popper.value = createPopper(select!.reference, proxy!.$el, {
            // 弹窗的展开方向，
            placement: props.placement,
            modifiers: [
              // 这决定了是否使用 GPU 加速样式来定位 popper
              {
                name: 'computeStyles',
                options: {
                  gpuAcceleration: false, // true by default
                },
              },
              //检测溢出
              {
                name: 'preventOverflow',
                options: {
                  rootBoundary: 'viewport',
                },
              },
              {
                name: 'offset',
                options: {
                  offset: [0, 5],
                },
              },
            ],
            // 第一次更新时触发
            onFirstUpdate: () => {
              nextTick(() => {
                popper.value && unref(popper)?.update();
              });
            },
          });
        }

        tIndex.value = handleGetIndex();
      });
    };

    // 销毁
    const destroy = () => {
      const _popper = unref(popper);

      if (_popper) {
        setTimeout(() => {
          if (_popper && !unref(popperStatus)) {
            _popper?.destroy();
            popper.value = undefined;
          }

          popperStatus.value = false;
        }, 300);
      }
    };

    // onMounted
    onMounted(() => {
      update();
    });

    // beforeUnmount
    onBeforeUnmount(() => {
      const _popper = unref(popper);

      if (_popper) {
        _popper.destroy();
        popper.value = undefined;
      }
    });

    return {
      // computed
      wrapperStyles,
      wrapperClass,

      // methods
      update,
      destroy,
    };
  },
});
</script>
