<template>
    <div :class="prefixCls">
        <!-- 显示分页 -->
        <div :class="`${prefixCls}--sizer`" v-if="showSizer">
            <ivue-select
                v-model="currentPageSize"
                :placement="placement"
                :transfer="transfer"
                :disabled="disabled"
                :transferClassName="`${prefixCls}--sizer__dropdown`"
                @on-change="handleChangeSize"
            >
                <ivue-option
                    v-for="(item, index) in pageSizeOpts"
                    :key="index"
                    :value="item"
                >{{ `${item} ${pageSizeText}` }}</ivue-option>
            </ivue-select>
        </div>
        <!-- 显示电梯 -->
        <div :class="`${prefixCls}--elevator`" v-if="showElevator">
            <span>{{ elevatorText[0] }}</span>
            <!-- 输入框 -->
            <input
                :class="`${prefixCls}--elevator__input`"
                type="text"
                :value="currentPage"
                :disabled="disabled"
                autocomplete="off"
                spellcheck="false"
                @keyup.enter="handleChangePage"
            />
            <span>{{ elevatorText[1] }}</span>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, getCurrentInstance } from 'vue';
import { IvueSelect, IvueOption } from '../ivue-select/index';
import { isValueNumber } from '../../utils/helpers';

// type
import type { Props } from './types/options';

const prefixCls = 'ivue-page-options';

export default defineComponent({
    name: prefixCls,
    emits: ['on-size', 'on-page'],
    props: {
        /**
         * 显示分页
         *
         * @type {Boolean}
         */
        showSizer: {
            type: Boolean,
        },
        /**
         * 每页条数
         *
         * @type {Number}
         */
        pageSize: {
            type: Number,
        },
        /**
         * 条数切换弹窗的展开方向，可选值为 bottom 和 top
         *
         * @type {String}
         */
        placement: {
            type: String,
        },
        /**
         * 是否将弹层放置于 body 内，在 Tabs、
         * 带有 fixed 的 Table 列内使用时，
         * 建议添加此属性，它将不受父级样式影响，
         * 从而达到更好的效果
         *
         * @type {Boolean}
         */
        transfer: {
            type: Boolean,
            default() {
                const global =
                    getCurrentInstance().appContext.config.globalProperties;

                return !global.$IVUE || global.$IVUE.transfer === ''
                    ? false
                    : global.$IVUE.transfer;
            },
        },
        /**
         * 是否禁用
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
        },
        /**
         * 页数选择选项
         *
         * @type {Array}
         */
        pageSizeOpts: {
            type: Array,
            default: () => [],
        },
        /**
         * 页数选择文字
         *
         * @type {Array}
         */
        pageSizeText: {
            type: String,
        },
        /**
         * 是否显示电梯
         *
         * @type {Boolean}
         */
        showElevator: {
            type: Boolean,
        },
        /**
         * 电梯文字
         *
         * @type {Array}
         */
        elevatorText: {
            type: Array,
            default: () => [],
        },
        /**
         * 当前页数
         *
         * @type {Number}
         */
        currentPage: {
            type: Number,
        },
        /**
         * 总页数
         *
         * @type {Number}
         */
        allPages: {
            type: Number,
        },
    },
    setup(props: Props, { emit }) {
        // 当前每页条数
        const currentPageSize = ref<number>(props.pageSize);

        // methods

        // 分页条数改变
        const handleChangeSize = (value: any) => {
            emit('on-size', value);
        };

        // 页数改变
        const handleChangePage = ({ target }) => {
            // 去除前后空格
            let value = target.value.trim();
            let page = 0;

            // 是否是纯数字
            if (isValueNumber(value)) {
                value = Number(value);

                // 不是当前页数
                if (value != props.currentPage) {
                    const allPages = props.allPages;

                    // 超过最大页数显示最大页数
                    if (value > allPages) {
                        page = allPages;
                    }
                    // 当前输入的值
                    else {
                        page = value;
                    }
                }
            }
            // 不是数字默认第一页
            else {
                page = 1;
            }

            // 有页数
            if (page) {
                emit('on-page', page);

                // 重新赋值
                target.value = page;
            }
        };

        // watch

        // 监听每页条数
        watch(
            () => props.pageSize,
            (value) => {
                currentPageSize.value = value;
            }
        );

        return {
            prefixCls,

            // data
            currentPageSize,

            // methods
            handleChangeSize,
            handleChangePage,
        };
    },
    components: {
        IvueSelect,
        IvueOption,
    },
});
</script>
