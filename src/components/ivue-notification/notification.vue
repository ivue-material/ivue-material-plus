<template>
    <transition-group name="ivue-notification-fade" tag="div" :class="classes" :style="wrapStyles">
        <template v-for="notice in data.noticesList" :key="notice.name">
            <notice
                :class="horizontalClass"
                :prefixCls="notice.prefixCls"
                :content="notice.content"
                :type="notice.type"
                :styles="notice.styles"
                :render="notice.render"
                :transitionName="notice.transitionName"
                :onClose="notice.onClose"
                :duration="notice.duration"
                :closable="notice.closable"
                :name="notice.name"
                :haveIcon="notice.haveIcon"
            ></notice>
        </template>
    </transition-group>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive, provide, PropType } from 'vue';
import Notice from './notice.vue';

import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

let seed = 0;
const now = Date.now();
const prefixCls = 'ivue-notification';

function getUuid() {
    return `IvueNotification${now}_${seed++}`;
}

export default defineComponent({
    props: {
        /**
         * 样式名称
         *
         * @type {String}
         */
        prefixCls: {
            type: String,
            default: prefixCls,
        },
        /**
         * 外部样式
         *
         * @type {String}
         */
        styles: {
            type: Object,
            default: function () {
                return {
                    top: '65px',
                    left: '50%',
                };
            },
        },
        content: {
            type: String,
            default: '',
        },
        /**
         * 样式名称
         *
         * @type {String}
         */
        className: {
            type: String,
        },
        /**
         * 动画名称
         *
         * @type {String}
         */
        transitionName: {
            type: String,
        },
        /**
         * 自定义弹出位置
         *
         * @type {String}
         */
        position: {
            type: String as PropType<Position>,
            default: 'top-right',
        },
    },
    setup(props: any) {
        // 获取Index
        const handleGetIndex = () => {
            transferIncrease();
            return transferIndex;
        };

        // data
        const data: any = reactive<{
            noticesList: Array<any>;
            tIndex: number;
        }>({
            /**
             * 通知列表
             *
             * @type {Array}
             */
            noticesList: [],
            /**
             * 当前index
             *
             * @type {Number}
             */
            tIndex: handleGetIndex(),
        });

        // computed

        // 外层样式
        const classes = computed(() => {
            return [
                props.prefixCls,
                {
                    [`${props.className}`]: props.className,
                },
            ];
        });

        // 外层style
        const wrapStyles = computed(() => {
            let styles = Object.assign({}, props.styles);
            styles['z-index'] = 1010 + data.tIndex;

            return styles;
        });

        // 弹出方向
        const horizontalClass = computed(() => {
            return props.position.indexOf('right') > 1 ? 'right' : 'left';
        });

        // methods

        // 添加通知列表
        const add = (notice, offset) => {
            const name = notice.name || getUuid();

            let _notice = Object.assign(
                {
                    styles: {
                        right: '50%',
                    },
                    content: '',
                    duration: 1.5,
                    closable: false,
                    name: name,
                },
                notice,
                offset
            );

            data.noticesList.push(_notice);

            // 当前index
            data.tIndex = handleGetIndex();
        };

        // 关闭通知
        const close = (name) => {
            const noticesList = data.noticesList;

            for (let i = 0; i < noticesList.length; i++) {
                if (noticesList[i].name === name) {
                    data.noticesList.splice(i, 1);

                    break;
                }
            }
        };
        // 关闭所有
        const closeAll = () => {
            data.noticesList = [];
        };

        // provide
        provide('IvueNotification', {
            close,
        });

        return {
            // data
            data,

            // computed
            classes,
            wrapStyles,
            horizontalClass,

            // methods
            add,
            close,
            closeAll,
        };
    },
    components: {
        Notice,
    },
});
</script>
