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

<script lang='ts'>
import {
    defineComponent,
    provide,
    reactive,
    toRefs,
    inject,
    ref,
    nextTick,
} from 'vue';

const prefixCls = 'ivue-select-group';

export default defineComponent({
    name: 'ivue-option-group',
    props: {
        /**
         * 选项grop标题
         *
         * @type {String}
         */
        label: {
            type: String,
            default: '',
        },
        /**
         * 是否禁用当选项
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        // inject
        const select: any = inject('ivue-select');

        const visible: any = ref(true);

        const list = ref(null);

        // methods
        const queryChange = () => {
            if (select.props.filterable) {
                if (select.props.filterableHiddenGroup) {
                    setTimeout(() => {
                        const children: any = list.value.children;

                        visible.value = [...children].some((option) => {
                            const visible = option.dataset.visible;
                            const _select = option.dataset.select;

                            // 是否是选项组件
                            if (_select) {
                                // 当前选项是否显示
                                return visible === 'true';
                            }
                        });
                    });
                } else {
                    nextTick(() => {
                        visible.value = select?.options?.some((option) => {
                            return option.data.visible === true;
                        });
                    });
                }
            }
        };

        // provide
        provide(
            'ivue-select-group',
            reactive({
                ...toRefs(props),
            })
        );

        // queryChange: queryChange

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
