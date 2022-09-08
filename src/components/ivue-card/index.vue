<template>
    <component
        :class="wrapperClasses"
        :style="wrapperStyles"
        :is="tagName"
        v-bind="tagProps"
        @click="handleLink"
    >
        <!-- 标题 -->
        <div :class="`${prefixCls}-title`" :style="titleStyles" v-if="showTitle">
            <slot name="title">{{ title }}</slot>
        </div>
        <!-- 额外显示的内容，默认位置在右上角 -->
        <div :class="`${prefixCls}-extra`" v-if="showExtra">
            <slot name="extra"></slot>
        </div>
        <!-- 内容 -->
        <div :class="`${prefixCls}-body`" :style="bodyStyles">
            <slot></slot>
        </div>
    </component>
</template>

<script lang='ts'>
import {
    computed,
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
} from 'vue';
import { oneOf } from '../../utils/assist';
import { isClient } from '../../utils/helpers';

const prefixCls = 'ivue-card';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 跳转的链接，支持 vue-router 对象
         *
         * @type {Object | String}
         */
        to: {
            type: [Object, String],
        },
        /**
         * 标题
         *
         * @type {String}
         */
        title: {
            type: String,
            default: '',
        },
        /**
         * 是否显示边框，建议在灰色背景下使用
         *
         * @type {Boolean}
         */
        border: {
            type: Boolean,
            default: true,
        },
        /**
         * 卡片阴影，建议在灰色背景下使用
         *
         * @type {Boolean}
         */
        shadow: {
            type: Boolean,
            default: false,
        },
        /**
         * 禁用鼠标悬停显示阴影
         *
         * @type {Boolean}
         */
        disHover: {
            type: Boolean,
            default: false,
        },
        /**
         * 卡片内部间距
         *
         * @type {Number | String}
         */
        padding: {
            type: [Number, String],
        },
        /**
         * 标题内部间距(paddingStylesLinkage开启该属性将不生效)
         *
         * @type {Number | String}
         */
        titlePadding: {
            type: [Number, String],
        },
        /**
         * 相当于 a 链接的 target 属性
         *
         * @type {String}
         */
        target: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['_blank', '_self', '_parent', '_top']);
            },
            default: '_self',
        },
        /**
         * 路由跳转时，开启 replace 将不会向 history 添加新记录
         *
         * @type {Boolean}
         */
        replace: {
            type: Boolean,
            default: true,
        },
        /**
         * 圆角
         *
         * @type {Number}
         */
        radius: {
            type: Number,
        },
        /**
         * 样式联动(联动标题和内容的padding)
         *
         * @type {Boolean}
         */
        paddingStylesLinkage: {
            type: Boolean,
            default: true,
        },
    },
    setup(props: any, { slots }) {
        const { proxy }: any = getCurrentInstance();

        // 是否显示标题
        const showTitle = ref(false);

        // 额外显示的内容，默认位置在右上角
        const showExtra = ref(false);

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-border`]: props.border && !props.shadow,
                    [`${prefixCls}-dis-hover`]: props.disHover || props.shadow,
                },
            ];
        });

        // 外部样式
        const wrapperStyles = computed(() => {
            // 圆角
            if (props.radius) {
                const regexp = new RegExp(/[a-zA-Z]/g);

                // 是否有单位
                const isUnit = regexp.test(props.radius);

                return {
                    borderRadius: !isUnit ? `${props.radius}px` : props.radius,
                };
            }

            return {};
        });

        // 标题样式
        const titleStyles = computed(() => {
            const padding = props.paddingStylesLinkage
                ? props.padding
                : props.titlePadding;

            // padding
            if (padding) {
                const regexp = new RegExp(/[a-zA-Z]/g);

                // 是否有单位
                const isUnit = regexp.test(padding);

                return {
                    padding: !isUnit ? `${padding}px` : padding,
                };
            }

            return {};
        });

        // 内容样式
        const bodyStyles = computed(() => {
            // 卡片内部间距
            if (props.padding) {
                const regexp = new RegExp(/[a-zA-Z]/g);

                // 是否有单位
                const isUnit = regexp.test(props.padding);

                return {
                    padding: !isUnit ? `${props.padding}px` : props.padding,
                };
            }

            return {};
        });

        // 是否是 a 标签
        const isHrefPattern = computed(() => {
            return !!props.to;
        });

        // 标签名称
        const tagName = computed(() => {
            // 是否是跳转链接
            return isHrefPattern.value ? 'a' : 'div';
        });

        // 跳转的链接
        const linkUrl = computed(() => {
            // 跳转的链接，支持 vue-router 对象
            const type = typeof props.to;

            // 判断是否字符串
            if (type !== 'string') {
                return null;
            }

            /* absolute url 不需要路由 */
            if (props.to.includes('//')) {
                return props.to;
            }

            // router
            const router = proxy.$router;

            // 是否有路由
            if (router) {
                // 当前路由
                const current = proxy.$route;

                // 路由对象
                const route = router.resolve(props.to, current);

                return route ? route.href : props.to;
            }

            return props.to;
        });

        // 标签属性
        const tagProps = computed(() => {
            // 链接
            if (isHrefPattern.value) {
                return {
                    href: linkUrl.value,
                    target: props.target,
                };
            } else {
                return {};
            }
        });

        // methods

        // 跳转链接
        const handleLink = (event) => {
            if (!isClient) {
                return;
            }

            // 是否是 a 标签
            if (!isHrefPattern.value) {
                return;
            }

            const openInNewWindow = event.ctrlKey || event.metaKey;

            // 跳转的链接
            if (props.to) {
                // blank
                if (props.target === '_blank') {
                    handleLinkBlank();
                } else {
                    event.preventDefault();

                    const router = props.$router;

                    // 打开新窗口
                    if (openInNewWindow) {
                        handleLinkBlank();
                    }
                    // 不是打开新窗口
                    else {
                        // 有路由
                        if (router) {
                            // url跳转
                            if (
                                typeof props.to === 'string' &&
                                props.to.includes('//')
                            ) {
                                window.location.href = props.to;
                            }
                            // 路由跳转
                            else {
                                props.replace
                                    ? router.replace(props.to, () => {})
                                    : router.push(props.to, () => {});
                            }
                        }
                        // 跳转链接
                        else {
                            window.location.href = props.to;
                        }
                    }
                }
            }
        };

        // 打开链接 blank
        const handleLinkBlank = () => {
            const router = proxy.$router;

            // 跳转的链接
            let to = props.to;

            if (router) {
                const current = props.$route;

                // 跳转路由
                const route = router.resolve(props.to, current);

                // 获取跳转链接
                to = route ? route.href : props.to;
            }

            if (typeof props.to === 'string') {
                return;
            }

            window.open(to);
        };

        // onMounted
        onMounted(() => {
            // 是否显示头部
            showTitle.value = props.title || slots.title !== undefined;

            // 额外显示的内容，默认位置在右上角
            showExtra.value = slots.extra !== undefined;
        });

        return {
            prefixCls,

            // data
            showTitle,
            showExtra,

            // computed
            tagName,
            wrapperClasses,
            wrapperStyles,
            titleStyles,
            bodyStyles,
            tagProps,

            // methods
            handleLink,
        };
    },
});
</script>
