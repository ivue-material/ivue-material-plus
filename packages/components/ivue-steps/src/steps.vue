<template>
  <div :class="wrapperClasses">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  provide,
  reactive,
  onMounted,
  watch,
  nextTick,
  onBeforeMount,
} from 'vue';

// tokens
import { StepsContextKey, Data } from '@ivue-material-plus/tokens';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';
// steps
import { stepsProps } from './steps';

const prefixCls = 'ivue-steps';

export default defineComponent({
  name: prefixCls,
  props: stepsProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // data
    const data = reactive<Data>({
      /**
       * 选项
       *
       * @type {Array}
       */
      options: [],
      /**
       * 步骤状态
       *
       * @type {String}
       */
      status: props.status,
      /**
       * 是否初始化数据
       *
       * @type {Boolean}
       */
      initData: false,
    });

    // computed

    const wrapperClasses = computed(() => {
      return [bem.b(), bem.is(props.direction)];
    });

    // methods

    // 更新数据
    const updateSteps = () => {
      // 初始化子组件data
      updateChildProps(true);
      // 设置错误步骤
      setNextError();
      // 更新当前数据
      updateCurrent();

      data.initData = false;
    };

    // 更新子组件props
    const updateChildProps = (isInit: boolean) => {
      data.options.map((child, index) => {
        // 更新步骤数
        child.data.stepNumber = index + 1;
        // 更新初始化下标
        child.data.index = index;

        // 如果已存在status,且在初始化时,则略过
        if (!(isInit && child.data.currentStatus)) {

          // index === 当前步骤
          if (index === props.currentStep) {
            if (data.status !== 'error') {
              // 设置进行中状态
              child.data.currentStatus = 'process';
            }
          }
          // index < 当前步骤 已完成
          else if (index < props.currentStep) {
            child.data.currentStatus = 'finish';
          }
          // index > 当前步骤 待进行
          else {
            child.data.currentStatus = 'wait';
          }
        }

        // 没有错误状态
        if (child.data.currentStatus !== 'error' && index != 0) {
          data.options[index - 1].data.nextError = false;
        }

        return child;
      });
    };

    // 设置错误步骤
    const setNextError = () => {
      data.options.map((child, index) => {
        if (child.data.currentStatus === 'error' && index !== 0) {
          data.options[index - 1].data.nextError = true;
        }
      });
    };

    // 更新当前数据
    const updateCurrent = () => {
      if (props.currentStep < 0 || props.currentStep >= data.options.length) {
        return;
      }

      data.options[props.currentStep].data.currentStatus = data.status;
    };

    // 选项销毁
    const handleOptionDestroy = (index: number) => {
      if (index > -1) {
        data.options.splice(index, 1);
      }
    };

    // provide
    provide(
      StepsContextKey,
      reactive({
        props,
        data,
        onOptionDestroy: handleOptionDestroy,
      })
    );

    onBeforeMount(() => {
      // 初始化数据
      data.options = [];
    });

    // onMounted
    onMounted(() => {
      data.initData = true;

      updateSteps();
    });

    // 监听数组变化
    watch(
      () => data.options,
      () => {
        if (!data.initData) {
          nextTick(() => {
            updateSteps();
          });
        }
      },
      {
        deep: true,
      }
    );

    // 监听进度
    watch(
      () => props.currentStep,
      () => {
        updateChildProps(false);
      }
    );

    // 监听步骤状态
    watch(
      () => props.status,
      () => {
        updateCurrent();
      }
    );

    return {
      bem,

      // data
      data,

      // computed
      wrapperClasses,

      // methods
      updateChildProps,
    };
  },
});
</script>
