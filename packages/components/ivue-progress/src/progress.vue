<template>
  <div :class="wrapClasses">
    <!-- 进度条 -->
    <div :class="bem.b('outer')">
      <!-- 内容样式 -->
      <div :class="bem.b('inner')">
        <!-- 背景 -->
        <div :class="bgClasser" :style="bgStyles">
          <!-- 百分比是否置于进度条内 -->
          <div :class="bem.be('inner', 'text')" v-if="textInside">{{ `${percent}%` }}</div>
        </div>
        <!-- 已完成的分段百分比 -->
        <div :class="bem.be('inner', 'success')" :style="successBgStyles"></div>
      </div>
    </div>
    <!-- 状态图标 -->
    <template v-if="!hideInfo && !textInside">
      <span :class="bem.b('text')">
        <slot>
          <!-- 图标 -->
          <span v-if="isStatus">
            <ivue-icon v-if="!icon">{{ statusIcon }}</ivue-icon>
            <i :class="icon" v-else></i>
          </span>
          <!-- 文案 -->
          <span v-else>{{ `${percent}%` }}</span>
        </slot>
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch, unref } from 'vue';

// hooks
import { useNamespace } from '@ivue-material-plus/hooks';
// progress
import { progressProps, progressEmits } from './progress';

// components
import IvueIcon from '@ivue-material-plus/components/ivue-icon';

const prefixCls = 'ivue-progress';

export default defineComponent({
    name: prefixCls,
    emits: progressEmits,
    props: progressProps,
    setup(props, { emit }) {
        // bem
        const bem = useNamespace(prefixCls);

        // data
        const currentStatus = ref<string>(props.status);

        // computed

        // 外层样式
        const wrapClasses = computed(() => {
            return [
                bem.b(),
                // 状态，可选值为normal、active、wrong、success
                bem.is(unref(currentStatus)),
                {
                    // 没有隐藏数值或状态图标 && 没有百分比是否置于进度条内
                    [bem.is('show-info')]: !props.hideInfo && !props.textInside,
                    // 是否在垂直方向显示
                    [bem.is('vertical')]: props.vertical,
                },
            ];
        });

        // 背景样式
        const bgClasser = computed(() => {
            return {
                [bem.b('bg')]: true,
                [bem.is('indeterminate')]: props.indeterminate,
            };
        });

        // 已完成的分段百分比 style
        const successBgStyles = computed(() => {
            // 垂直方向
            if (props.vertical) {
                return {
                    height: `${props.successPercent}%`,
                    width: `${props.strokeWidth}px`,
                };
            } else {
                return {
                    width: `${props.successPercent}%`,
                    height: `${props.strokeWidth}px`,
                };
            }
        });

        //背景样式
        const bgStyles = computed(() => {
            let style: {
                height?: string;
                width?: string;
                boxShadow?: string;
                animationDuration?: string;
                backgroundColor?: string;
                backgroundImage?: string;
            } = {};

            // 垂直方向
            if (props.vertical) {
                style = {
                    height: `${props.percent}%`,
                    width: `${props.strokeWidth}px`,
                };
            } else {
                style = {
                    width: `${props.percent}%`,
                    height: `${props.strokeWidth}px`,
                    boxShadow: `0 0px 5px ${props.boxShadowColor}`,
                };
            }

            // 是否有进度条颜色
            if (props.strokeColor) {
                if (typeof props.strokeColor === 'string') {
                    style.backgroundColor = props.strokeColor;
                } else {
                    style.backgroundImage = `linear-gradient(to right, ${props.strokeColor[0]} 0%, ${props.strokeColor[1]} 100%)`;
                }
            }

            style.animationDuration = `${props.duration}s`;

            return style;
        });

        // 状态图标
        const statusIcon = computed(() => {
            let type = '';

            // 警告
            if (currentStatus.value === 'warning') {
                type = 'warning';
            }

            // 错误
            if (currentStatus.value === 'wrong') {
                type = 'cancel';
            }

            // 成功
            if (currentStatus.value === 'success') {
                type = 'check_circle';
            }

            return type;
        });

        // 是否有状态
        const isStatus = computed(() => {
            return (
                currentStatus.value === 'wrong' ||
                currentStatus.value === 'success' ||
                currentStatus.value === 'warning'
            );
        });

        // methods

        // 状态事件
        const handleStatus = (init: boolean) => {
            // 初始化
            if (init) {
                currentStatus.value = 'normal';

                emit('on-status-change', 'normal');
            }
            // 成功状态
            else {
                if (parseInt(`${props.percent}`, 10) == 100) {
                    currentStatus.value = 'success';

                    emit('on-status-change', 'success');
                }
            }
        };

        // onMounted
        onMounted(() => {
            handleStatus(false);
        });

        // watch

        // 监听进度条
        watch(
            () => props.percent,
            (value, oldValue) => {
                if (value < oldValue) {
                    handleStatus(true);
                } else {
                    handleStatus(false);
                }
            }
        );

        // 监听状态
        watch(
            () => props.status,
            (status) => {
                currentStatus.value = status;
            }
        );

        return {
            // bem
            bem,

            // data
            currentStatus,

            // computed
            wrapClasses,
            bgClasser,
            bgStyles,
            statusIcon,
            isStatus,
            successBgStyles,

            // methods
            handleStatus,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
