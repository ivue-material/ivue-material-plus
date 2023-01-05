<template>
    <div :class="wrapperClasses">
        <!-- 标签 -->
        <form-label-wrap>
            <component
                :class="`${prefixCls}--label`"
                :is="labelFor ? 'label' : 'div'"
                :id="labelId"
                :for="labelFor"
                :style="labelStyle"
                v-if="showLabel"
            >
                <slot name="label" :label="currentLabel">{{ currentLabel }}</slot>
            </component>
        </form-label-wrap>
        <!-- 内容 -->
        <div :class="`${prefixCls}--content`" :style="contentStyle">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    ref,
    provide,
    reactive,
    toRefs,
    inject,
} from 'vue';
import FormLabelWrap from './form-label-wrap';

import { useId } from '../../hooks';
import { addUnit } from '../../utils/dom/style';

// type
import type { CSSProperties } from 'vue';
import { FormContextKey } from './types/form';
import { Props, FormItemContextKey } from './types/form-item';

const prefixCls = 'ivue-form-item';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 标签文本
         *
         * @type {String}
         */
        label: {
            type: String,
        },
        /**
         * 属性规定 label 与哪个表单元素绑定
         *
         * @type {String}
         */
        for: {
            type: String,
        },
        /**
         * 标签宽度
         *
         * @type {String | Number}
         */
        labelWidth: {
            type: [String, Number],
            default: '',
        },
    },
    setup(props: Props, { slots }) {
        // form inject
        const formContext = inject(FormContextKey, undefined);
        // 父级item
        const parentFormItemContext = inject(FormItemContextKey, undefined);

        // 是否是嵌套的item
        const isNested = !!parentFormItemContext;

        // label id
        const labelId = useId().value;

        // ref

        // 输入框id
        const inputIds = ref<string[]>([]);

        // computed

        // class
        const wrapperClasses = computed(() => {
            return [prefixCls, {}];
        });

        // 属性规定 label 与哪个表单元素绑定
        const labelFor = computed(() => {
            return props.for || inputIds.value.length === 1
                ? inputIds.value[0]
                : undefined;
        });

        // 当前标签文本
        const currentLabel = computed(
            () => `${props.label || ''}${formContext?.labelSuffix || ''}`
        );

        // 标签样式
        const labelStyle = computed<CSSProperties>(() => {
            let obj = {};

            if (formContext?.labelPosition === 'top') {
                return obj;
            }

            // 添加单位
            const labelWidth = addUnit(
                props.labelWidth || formContext?.labelWidth || ''
            );

            if (labelWidth) {
                obj = {
                    width: labelWidth,
                };
            }

            return obj;
        });

        // 是否显示标签
        const showLabel = computed<boolean>(() => {
            return !!(props.label || slots.label);
        });

        // 内容样式
        const contentStyle = computed<CSSProperties>(() => {
            let obj = {};

            if (formContext?.labelPosition === 'top') {
                return obj;
            }

            // 是嵌套的item
            if (!props.label && !props.labelWidth && isNested) {
                return obj;
            }

            // 添加单位
            const labelWidth = addUnit(
                props.labelWidth || formContext?.labelWidth || ''
            );

            if (!props.label && !slots.label) {
                obj = {
                    marginLeft: labelWidth,
                };
            }

            return obj;
        });

        // methods

        // 添加输入框id
        const addInputId = (id: string) => {
            if (!inputIds.value.includes(id)) {
                inputIds.value.push(id);
            }
        };

        // 删除输入框id
        const removeInputId = (id: string) => {
            inputIds.value = inputIds.value.filter((listId) => listId !== id);
        };

        // provide
        provide(
            FormItemContextKey,
            reactive({
                ...toRefs(props),
                addInputId,
                removeInputId,
            })
        );

        return {
            prefixCls,
            labelId,

            // data

            // computed
            wrapperClasses,
            labelStyle,
            contentStyle,
            currentLabel,
            labelFor,
            showLabel,

            // methods
            addInputId,
            removeInputId,
        };
    },
    components: {
        FormLabelWrap,
    },
});
</script>
