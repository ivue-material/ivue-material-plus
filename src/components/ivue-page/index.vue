<template>
    <!-- 简洁版 -->
    <ul :class="simpleWrapperClasses" v-if="simple">
        <!-- 上一页按钮 -->
        <li :class="prevClass" @click="handlePrev">
            <slot name="prev">
                <ivue-icon>{{ prevIcon }}</ivue-icon>
            </slot>
        </li>

        <!-- 输入框 -->
        <div :class="simplePageClasses">
            <!-- 输入框 -->
            <input
                :class="`${prefixCls}-simple-input`"
                type="text"
                autocomplete="off"
                spellcheck="false"
                :value="data.currentPage"
                :disabled="disabled"
                @keydown="handleKeyDown"
                @keyup="handleKeyUp"
                @change="handleKeyUp"
            />
            <!-- 符号 -->
            <span :class="`${prefixCls}-simple-sign`">/</span>
            <!-- 所有页数 -->
            <span>{{ allPages }}</span>
        </div>

        <!-- 下一页按钮 -->
        <li :class="nextClass" @click="handleNext">
            <slot name="next">
                <ivue-icon>{{ nextIcon }}</ivue-icon>
            </slot>
        </li>
    </ul>
    <!-- 正常版 -->
    <ul :class="wrapperClass" v-else>
        <!-- 数据总条数 -->
        <span :class="`${prefixCls}-total`" v-if="showTotal">
            <slot name="total">{{ `共 ${total} 条` }}</slot>
        </span>
        <!-- 上一页按钮 -->
        <li :class="prevClass" @click="handlePrev">
            <slot name="prev">
                <ivue-icon>{{ prevIcon }}</ivue-icon>
            </slot>
        </li>
        <!-- 第一页 -->
        <li :class="firstClass" @click="handleCangePage(1)">
            <span :class="itemTextClass">1</span>
        </li>

        <!-- 上一页更多 -->
        <li :class="abbreviationClass" v-show="data.showPrevMore" @click="handleFastPrev">
            <slot name="prevArrow">
                <!-- 箭头 -->
                <span class="arrow">
                    <ivue-icon>chevron_left</ivue-icon>
                    <ivue-icon>chevron_left</ivue-icon>
                </span>
                <!-- 缩略号 -->
                <ivue-icon class="abbreviation">more_horiz</ivue-icon>
            </slot>
        </li>

        <!-- 选项 -->
        <li
            :class="{
                ...itemClass,
                [`${prefixCls}-item--active`]: item === data.currentPage
            }"
            v-for="(item, index) in pagerList"
            :key="index"
            @click="handleCangePage(item)"
        >
            <span :class="itemTextClass">{{ item }}</span>
        </li>

        <!-- 下一页更多 -->
        <li :class="abbreviationClass" v-show="data.showNextMore" @click="handleFastNext">
            <slot name="nextArrow">
                <!-- 箭头 -->
                <span class="arrow">
                    <ivue-icon>chevron_right</ivue-icon>
                    <ivue-icon>chevron_right</ivue-icon>
                </span>
                <!-- 缩略号 -->
                <ivue-icon class="abbreviation">more_horiz</ivue-icon>
            </slot>
        </li>

        <!-- 最后一页 -->
        <li :class="lastClass" @click="handleCangePage(allPages)">
            <span :class="itemTextClass">{{ allPages }}</span>
        </li>

        <!-- 下一页按钮 -->
        <li :class="nextClass" @click="handleNext">
            <slot name="next">
                <ivue-icon>{{ nextIcon }}</ivue-icon>
            </slot>
        </li>

        <!-- 显示分页 -->
        <options
            :showSizer="showSizer"
            :showElevator="showElevator"
            :pageSize="pageSize"
            :placement="placement"
            :transfer="transfer"
            :disabled="disabled"
            :pageSizeOpts="pageSizeOpts"
            :pageSizeText="pageSizeText"
            :elevatorText="elevatorText"
            :currentPage="data.currentPage"
            :allPages="allPages"
            @on-size="handleChangeSize"
            @on-page="handleChangePage"
        ></options>
    </ul>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive, watch } from 'vue';
import { oneOf } from '../../utils/assist';

import IvueIcon from '../ivue-icon/index.vue';
import Options from './options.vue';

const prefixCls = 'ivue-page';

export default defineComponent({
    name: prefixCls,
    emits: [
        'on-prev',
        'update:modelValue',
        'on-change',
        'on-next',
        'on-page-size-change',
    ],
    props: {
        /**
         * v-model
         *
         * @type {Number}
         */
        modelValue: {
            type: Number,
            default: 1,
        },
        /**
         * 显示总条数
         *
         * @type {Boolean}
         */
        showTotal: {
            type: Boolean,
            default: false,
        },
        /**
         * 数据总数
         *
         * @type {Number}
         */
        total: {
            type: Number,
            default: 0,
        },
        /**
         * 上一页图标
         *
         * @type {String}
         */
        prevIcon: {
            type: String,
            default: 'keyboard_arrow_left',
        },
        /**
         * 下一页图标
         *
         * @type {String}
         */
        nextIcon: {
            type: String,
            default: 'keyboard_arrow_right',
        },
        /**
         * 是否禁用
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 每页条数
         *
         * @type {Number}
         */
        pageSize: {
            type: Number,
            default: 10,
        },
        /**
         * 页码按钮的数量，当总页数超过该值时会折叠
         * 大于等于 5 且小于等于 21 的奇数
         *
         * @type {Number}
         */
        pagerCount: {
            type: Number,
            validator(value: number) {
                return (
                    (value | 0) === value &&
                    value > 4 &&
                    value < 22 &&
                    value % 2 === 1
                );
            },
            default: 7,
        },
        /**
         * 显示分页，用来改变page-size
         *
         * @type {Boolean}
         */
        showSizer: {
            type: Boolean,
            default: false,
        },
        /**
         * 条数切换弹窗的展开方向，可选值为 bottom 和 top
         *
         * @type {String}
         */
        placement: {
            validator(value: string) {
                return oneOf(value, ['top', 'bottom']);
            },
            default: 'bottom',
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
            default: false,
        },
        /**
         * 页数选择选项
         *
         * @type {Array}
         */
        pageSizeOpts: {
            type: Array,
            default: () => [10, 20, 30, 40],
        },
        /**
         * 页数选择文字
         *
         * @type {Array}
         */
        pageSizeText: {
            type: String,
            default: '条/页',
        },
        /**
         * 是否显示电梯
         *
         * @type {Boolean}
         */
        showElevator: {
            type: Boolean,
            default: false,
        },
        /**
         * 电梯文字
         *
         * @type {Array}
         */
        elevatorText: {
            type: Array,
            default: () => ['跳至', '页'],
        },
        /**
         * 是否使用小型分页样式
         *
         * @type {Boolean}
         */
        small: {
            type: Boolean,
            default: false,
        },
        /**
         * 简洁版
         *
         * @type {Boolean}
         */
        simple: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any, { slots, emit }) {
        // data
        const data = reactive<{
            currentPage: number;
            currentPageSize: number;
            showPrevMore: boolean;
            showNextMore: boolean;
        }>({
            // 当前页数
            currentPage: props.modelValue,
            // 当前每页条数
            currentPageSize: props.pageSize,
            // 显示更多上一页
            showPrevMore: false,
            // 显示更多下一页
            showNextMore: false,
        });

        // 外层样式
        const wrapperClass = computed(() => {
            return [
                prefixCls,
                {
                    // 是否使用小型分页样式
                    [`${prefixCls}-small`]: props.small,
                },
            ];
        });

        // 上一页样式
        const prevClass = computed(() => {
            return [
                `${prefixCls}-prev`,
                {
                    // 选项样式
                    ...itemClass.value,
                    [`${prefixCls}-slot`]: slots.prev,
                    [`${prefixCls}-disabled`]:
                        data.currentPage === 1 || props.disabled,
                },
            ];
        });

        // 下一页样式
        const nextClass = computed(() => {
            return [
                `${prefixCls}-next`,
                {
                    // 选项样式
                    ...itemClass.value,
                    [`${prefixCls}-slot`]: slots.next,
                    [`${prefixCls}-disabled`]:
                        data.currentPage === allPages.value || props.disabled,
                },
            ];
        });

        // 选项样式
        const itemClass = computed(() => {
            return {
                [`${prefixCls}-item`]: true,
            };
        });

        // 选项文字样式
        const itemTextClass = computed(() => {
            return {
                [`${prefixCls}-item--text`]: true,
            };
        });

        // 第一页按钮
        const firstClass = computed(() => {
            return {
                // 选项样式
                ...itemClass.value,
                // 激活
                [`${prefixCls}-item--active`]: data.currentPage === 1,
            };
        });

        // 最后一页按钮
        const lastClass = computed(() => {
            return {
                // 选项样式
                ...itemClass.value,
                // 激活
                [`${prefixCls}-item--active`]:
                    data.currentPage === allPages.value,
            };
        });

        // 缩略号样式
        const abbreviationClass = computed(() => {
            return {
                ...itemClass.value,
                [`${prefixCls}-abbreviation`]: true,
            };
        });

        // 简洁版
        const simpleWrapperClasses = computed(() => {
            return [prefixCls, `${prefixCls}-simple`];
        });

        // 输入框
        const simplePageClasses = computed(() => {
            return `${prefixCls}-simple-page`;
        });

        // 获取所有页数
        const allPages = computed(() => {
            // 总条数 / 当前每页条数 (100 / 10) = 10
            const allPage = Math.ceil(props.total / data.currentPageSize);

            // 默认显示1页
            return allPage === 0 ? 1 : allPage;
        });

        // 计算选项数量
        const pagerList = computed(() => {
            // 页码按钮的数量，当总页数超过该值时会折叠
            const pagerCount = props.pagerCount;
            // 获取一半的数量
            // (7 - 1) 偶数 / 2
            const halfPagerCount = (pagerCount - 1) / 2;

            // 当前页数
            const currentPage = data.currentPage;

            // 显示更多上一页
            let showPrevMore = false;
            // 显示更多下一页
            let showNextMore = false;

            // 总页数超过该值时折叠 10 > 7
            if (allPages.value > pagerCount) {
                // 当前页数 > (页码按钮的数量 - 获取一半的数量)
                if (currentPage > pagerCount - halfPagerCount) {
                    showPrevMore = true;
                }

                // 当前页数 < (总页码数 - 获取一半的数量)
                if (currentPage < allPages.value - halfPagerCount) {
                    showNextMore = true;
                }
            }

            // 显示更多上一页
            data.showPrevMore = showPrevMore;
            // 显示更多下一页
            data.showNextMore = showNextMore;

            // 页数列表
            const array = [];

            // 有更多上一页 没有更多下一页
            if (showPrevMore && !showNextMore) {
                // 10 - 7 - 2
                // 省略号后-开始的页数 总页数 - (页码按钮的数量 - 前后页码(2 = 1, 10))
                const startPage = allPages.value - (pagerCount - 2);

                // [5,6,7,8,9]  总页数 10
                for (let i = startPage; i < allPages.value; i++) {
                    array.push(i);
                }
            }
            // 没有更多上一页 有更多下一页
            else if (!showPrevMore && showNextMore) {
                // [2,3,4,5,6]
                // 从第二页开始循环 2.....  pagerCount = 页码按钮的数量
                for (let i = 2; i < pagerCount; i++) {
                    array.push(i);
                }
            }
            // 有更多上一页 有更多下一页
            else if (showPrevMore && showNextMore) {
                // 中间值开始下标 页码按钮的数量 floor(7 / 2 = 3.5) = 3 -1 = 2
                const offset = Math.floor(pagerCount / 2) - 1;

                // i = 当前页数(5) - 中间值开始下标(2) = 3
                // i <= 当前页数(5) + 中间值开始下标(2) = 7
                for (
                    let i = currentPage - offset;
                    i <= currentPage + offset;
                    i++
                ) {
                    array.push(i);
                }
            }
            // 没有省略号
            else {
                // 第二页开始循环 循环总页数
                for (let i = 2; i < allPages.value; i++) {
                    array.push(i);
                }
            }

            return array;
        });

        // methods

        // 上一页
        const handlePrev = () => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 当前页数
            const current = data.currentPage;

            // 第一页不执行
            if (current <= 1) {
                return false;
            }

            // 当前页数 - 1
            const page = current - 1;

            // 改变页数
            handleCangePage(page);

            // 切换上一页时触发，返回切换后的页码
            emit('on-prev', page);
        };

        // 下一页
        const handleNext = () => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 当前页数
            const current = data.currentPage;

            // 当前页数 >= 最大页数
            if (current >= allPages.value) {
                return false;
            }

            // 当前页数 + 1
            const page = current + 1;

            // 改变页数
            handleCangePage(page);

            // 切换上一页时触发，返回切换后的页码
            emit('on-next', page);
        };

        // 改变页数
        const handleCangePage = (page) => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 点击不是当前激活页数
            if (data.currentPage != page) {
                data.currentPage = page;

                // v-model
                emit('update:modelValue', page);

                // 页码改变的回调，返回改变后的页码
                emit('on-change', page);
            }
        };

        // 快速前进上一页
        const handleFastPrev = () => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 前进后的页数 当前页数 - 5
            const page = data.currentPage - 5;

            // 前进后的页数 > 0
            if (page > 0) {
                handleCangePage(page);
            }
            // 返回第一页
            else {
                handleCangePage(1);
            }
        };

        // 快速前进下一页
        const handleFastNext = () => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 前进后的页数 当前页数 + 5
            const page = data.currentPage + 5;

            // 前进后的页数 > 总页数
            if (page > allPages.value) {
                handleCangePage(allPages.value);
            }
            // 前进后的页数 1 + 5 = 6 前进到弟6页
            else {
                handleCangePage(page);
            }
        };

        // 分页条数改变
        const handleChangeSize = (value: number) => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 当前每页条数
            data.currentPageSize = value;

            emit('on-page-size-change', value);

            // 重置页数到第一页
            handleCangePage(1);
        };

        // 页数改变
        const handleChangePage = (value: number) => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 跳转页数
            handleCangePage(value);
        };

        // 键盘按下
        const handleKeyDown = (event) => {
            const key = event.keyCode;

            const condition =
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105) ||
                key === 8 ||
                key === 37 ||
                key === 39;

            if (!condition) {
                event.preventDefault();
            }
        };

        // 键盘弹起
        const handleKeyUp = (event) => {
            const key = event.keyCode;
            const value = parseInt(event.target.value);

            // 上一页
            if (key === 38) {
                handlePrev();
            }
            // 下一页
            else if (key === 40) {
                handleNext();
            }
            // 确认
            else if (key === 13) {
                let page = 1;

                // 超过最大页数
                if (value > allPages.value) {
                    page = allPages.value;
                }
                // 小于0
                else if (value <= 0 || !value) {
                    page = 1;
                }
                // 当前页数
                else {
                    page = value;
                }

                event.target.value = page;

                // 改变页数
                handleCangePage(page);
            }
        };

        // watch

        // 监听总数
        watch(
            () => props.total,
            (value) => {
                // 最大页数 100 / 10 返回大于或等于一个给定数字的最小整数
                const maxPage = Math.ceil(value / data.currentPageSize);

                // 最大页数小于当前页数
                if (maxPage < data.currentPage) {
                    data.currentPage = maxPage === 0 ? 1 : maxPage;
                }
            }
        );

        // 监听 v-model
        watch(
            () => props.modelValue,
            (value) => {
                data.currentPage = value;
            }
        );

        // 监听每页条数
        watch(
            () => props.pageSize,
            (value) => {
                data.currentPageSize = value;
            }
        );

        return {
            prefixCls,
            // data
            data,

            // computed
            wrapperClass,
            prevClass,
            nextClass,
            itemClass,
            itemTextClass,
            firstClass,
            allPages,
            lastClass,
            abbreviationClass,
            pagerList,
            simpleWrapperClasses,
            simplePageClasses,

            // methods
            handlePrev,
            handleNext,
            handleCangePage,
            handleFastPrev,
            handleFastNext,
            handleChangeSize,
            handleChangePage,
            handleKeyDown,
            handleKeyUp,
        };
    },
    components: {
        IvueIcon,
        Options,
    },
});
</script>
