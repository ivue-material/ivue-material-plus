<template>
    <transition :name="computedTransition">
        <div class="ivue-tabs-content" v-show="data.isActive" ref="content">
            <slot></slot>
        </div>
    </transition>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    onMounted,
    onBeforeUnmount,
    inject,
    getCurrentInstance,
    computed,
    ref,
} from 'vue';

export default defineComponent({
    name: 'ivue-tab-item',
    props: {
        transition: {
            type: [Boolean, String],
            default: 'tab-transition',
        },
        reverseTransition: {
            type: [Boolean, String],
            default: 'tab-reverse-transition',
        },
    },
    setup(props) {
        // inject
        const tabsGroup: any = inject('tabsGroup');

        const content = ref(null);

        // vm
        const { proxy, uid } = getCurrentInstance();

        // data
        const data: any = reactive<{
            isActive: Boolean;
            reverse: Boolean;
            name: String | number;
        }>({
            /**
             * 是否激活
             *
             * @type  {Boolean}
             */
            isActive: false,
            /**
             * 方向
             *
             * @type {Boolean}
             */
            reverse: false,
            /**
             * 当前 name
             *
             * @type {Number}
             */
            name: uid,
        });

        // computed

        const computedTransition = computed(() => {
            return data.reverse ? props.reverseTransition : props.transition;
        });

        // methods

        // 切换
        const handleToggle = (
            isActive: boolean,
            reverse: boolean,
            showTransition
        ) => {
            data.reverse = reverse;

            data.isActive = isActive;

             content.value.style.transition = !showTransition ? 'none' : null;
        };

        // onMounted
        onMounted(() => {
            // 插入dom
            tabsGroup.data.tabsItem.push(proxy);
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            tabsGroup.unregisterItems(data.name);
        });

        return {
            // dom
            content,

            // data
            data,

            // computed
            computedTransition,

            // methods
            handleToggle,
        };
    },
});
</script>
