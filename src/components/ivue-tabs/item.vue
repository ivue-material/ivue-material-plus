<template>
    <transition :name="computedTransition">
        <div class="ivue-tabs-content" v-show="isActive" ref="content">
            <slot></slot>
        </div>
    </transition>
</template>

<script lang='ts'>
import {
    defineComponent,
    onMounted,
    onBeforeUnmount,
    inject,
    getCurrentInstance,
    computed,
    ref,
} from 'vue';

// type
import { TabsContextKey } from './types/tabs';
import type { Props } from './types/item';

export default defineComponent({
    name: 'ivue-tab-item',
    props: {
        /**
         * 前进transition
         *
         * @type {String}
         */
        transition: {
            type: String,
            default: 'tab-transition',
        },
        /**
         * 反向transition
         *
         * @type {String}
         */
        reverseTransition: {
            type: String,
            default: 'tab-reverse-transition',
        },
    },
    setup(props: Props) {
        // vm
        const { proxy, uid } = getCurrentInstance();

        // inject
        const tabsGroup = inject(TabsContextKey);

        // data
        const content = ref<HTMLElement>(null);

        // 是否激活
        const isActive = ref<boolean>(false);
        // 方向
        const reverse = ref<boolean>(false);
        // 当前 name
        const name = ref<number>(uid);

        // computed

        const computedTransition = computed(() => {
            return reverse.value ? props.reverseTransition : props.transition;
        });

        // methods

        // 切换
        const handleToggle = (
            _isActive: boolean,
            _reverse: boolean,
            showTransition: boolean
        ) => {
            reverse.value = _reverse;

            isActive.value = _isActive;

            content.value.style.transition = !showTransition ? 'none' : null;
        };

        // onMounted
        onMounted(() => {
            // 插入dom
            tabsGroup.data.tabsItem.push(proxy);
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            tabsGroup.unregisterItems(name.value);
        });

        return {
            // dom
            content,

            // data
            isActive,

            // computed
            computedTransition,

            // methods
            handleToggle,
        };
    },
});
</script>
