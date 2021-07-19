<template>
    <ul :class="prefixCls">
        <template v-for="(file, index) in files" :key="file.uid">
            <li :class="fileStatusClass(file)" v-show="isImageFile(file)">
                <!-- 图片 -->
                <div
                    :class="`${prefixCls}-image`"
                    @click="handleFileData(file)"
                    :style="getSizeStyle(file.previewSize || previewSize)"
                >
                    <img
                        :src="file.content || file.url"
                        :class="`${prefixCls}-image__img`"
                        :style="imgStyle(file)"
                    />
                </div>
                <!-- 蒙层 -->
                <div :class="`${prefixCls}-mask`" v-if="currentStatus(file)">
                    <!-- 加载中 -->
                    <div
                        :class="`${prefixCls}-mask__loading`"
                        v-ivueloading="file.status === 'uploading'"
                        v-if="file.status === 'uploading'"
                    ></div>
                    <!-- 错误图标 -->
                    <template v-if="file.status === 'failed'">
                        <ivue-icon :class="`${prefixCls}-mask__icon`" v-if="!failedIcon">cancel</ivue-icon>
                        <i :class="[`${prefixCls}-mask__icon`, failedIcon]" v-else></i>
                    </template>
                    <!-- 描述的信息 -->
                    <div
                        :class="`${prefixCls}-mask__message`"
                        v-if="file.message "
                    >{{ file.message }}</div>
                </div>
                <!-- 删除按钮 -->
                <ivue-icon
                    :class="`${prefixCls}-remove`"
                    @click.stop="handleRemove(file, index)"
                    v-if="isDeletable(file)"
                >close</ivue-icon>
                <!-- 自定义覆盖在预览区域上方的内容 -->
                <div class="preview-cover" v-if="$slots['preview-cover']">
                    <slot name="preview-cover" :file="file"></slot>
                </div>
            </li>
        </template>
    </ul>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import ivueloading from '../ivue-loading/directive';
import IvueIcon from '../ivue-icon/index.vue';
import { callInterceptor, Interceptor } from '../../utils/interceptor';
import { isImageFile, getSizeStyle } from '../../utils/helpers';

const prefixCls = 'ivue-upload-list';

export default defineComponent({
    name: prefixCls,
    directives: {
        ivueloading,
    },
    props: {
        /**
         * 上传的文件的列表
         *
         * @type {Array}
         */
        files: {
            type: Array,
            default: () => [],
        },
        /**
         * 错误时的图标
         *
         * @type {String}
         */
        failedIcon: {
            type: String,
            default: '',
        },
        /**
         * 是否展示删除按钮
         *
         * @type {Boolean}
         */
        deletable: {
            type: Boolean,
        },
        /**
         * 文件删除前的回调函数，返回 false 可终止文件读取，
         * 支持返回 Promise
         *
         * @type {Function}
         */
        beforeDelete: {
            type: Function as PropType<Interceptor>,
        },
        /**
         * 标识符，可以在回调函数的第二项参数中获取
         *
         * @type {Number, String}
         */
        name: {
            type: [Number, String],
            default: '',
        },
        /**
         * 预览图和上传区域的尺寸，默认单位为 px
         *
         * @type {Number | String}
         */
        previewSize: [Number, String],
    },
    setup(props, { emit }) {
        // methods

        // 有删除
        const isDeletable = (file) => {
            // 自定义单个图片预览
            if (typeof file.deletable !== 'undefined') {
                if (file.deletable && file.status !== 'uploading') {
                    return true;
                }
            } else if (props.deletable && file.status !== 'uploading') {
                return true;
            }

            return false;
        };

        // 文件上传状态
        const fileStatusClass = (file) => {
            return [
                `${prefixCls}-status`,
                {
                    [`${prefixCls}-status-finish`]: file.status === 'finished',
                },
            ];
        };

        // 获取当前状态
        const currentStatus = (item) => {
            const { status } = item;

            if (status === 'uploading' || status === 'failed') {
                return true;
            }

            if (status === 'failed') {
                return true;
            }

            return false;
        };

        // 删除按钮
        const handleRemove = (file, index) => {
            const item = file;
            const { name, beforeDelete } = props;

            // 拦截器
            callInterceptor({
                // 拦截参数
                interceptor: beforeDelete,
                // 数据
                args: [item, { name, index }],
                done: () => emit('delete', file, index),
            });
        };

        // 返回文件数据
        const handleFileData = (file) => {
            emit('preview', file);
        };

        // 图片样式
        const imgStyle = (file) => {
            let obj = {};

            if (file.imageFit) {
                obj = {
                    'object-fit': file.imageFit,
                };
            }

            return obj;
        };

        return {
            prefixCls,

            // methods
            fileStatusClass,
            currentStatus,
            handleRemove,
            handleFileData,
            isImageFile,
            isDeletable,
            imgStyle,
            getSizeStyle
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
