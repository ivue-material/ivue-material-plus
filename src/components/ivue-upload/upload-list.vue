<template>
    <ul :class="prefixCls">
        <template v-for="(file, index) in files" :key="file.uid">
            <li :class="fileStatusClass(file)" v-show="isImageFile(file)">
                <!-- 图片 -->
                <div
                    :class="imageClass(file)"
                    @click="handleFileData(file, index)"
                    :style="getSizeStyle(file.previewSize || previewSize)"
                >
                    <img
                        :src="file.content || file.url"
                        :class="`${prefixCls}-image__img`"
                        :style="imgStyle(file)"
                    />

                    <!-- 自定义预览图片区域内容 -->
                    <div :class="`${prefixCls}-preview--image`">
                        <slot name="preview-image">
                            <!-- 预览图标 -->
                            <ivue-icon :class="`${prefixCls}-preview-icon`">visibility</ivue-icon>
                        </slot>
                    </div>
                </div>
                <!-- 蒙层 -->
                <transition name="fade">
                    <div :class="`${prefixCls}-mask`" v-if="currentStatus(file)">
                        <!-- 加载中 -->
                        <div
                            :class="`${prefixCls}-mask__loading`"
                            v-ivue-loading="file.status === 'uploading'"
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
                            v-if="file.message"
                        >{{ file.message }}</div>
                    </div>
                </transition>
                <!-- 删除按钮 -->
                <ivue-icon
                    :class="`${prefixCls}-remove`"
                    @click.stop="handleRemove(file, index)"
                    v-if="isDeletable(file)"
                >close</ivue-icon>

                <!-- 自定义覆盖在预览区域上方的内容 -->
                <template v-if="$slots['preview-cover']">
                    <slot name="preview-cover" :file="file"></slot>
                </template>
            </li>
        </template>
    </ul>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import IvueLoading from '../ivue-loading/directive';
import IvueIcon from '../ivue-icon/index.vue';
import { callInterceptor, Interceptor } from '../../utils/interceptor';
import { isImageFile, getSizeStyle } from '../../utils/helpers';

// type
import { Props, File } from './types/upload-list';

const prefixCls = 'ivue-upload-list';

export default defineComponent({
    name: prefixCls,
    directives: {
        IvueLoading,
    },
    props: {
        /**
         * 上传的文件的列表
         *
         * @type {Array}
         */
        files: {
            type: Array as PropType<File[]>,
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
        /**
         * 预览图片放大
         *
         * @type {Boolean}
         */
        previewFullImage: {
            type: Boolean,
            default: true,
        },
        /**
         * 预览图裁剪模式
         *
         * @type {String}
         */
        imageFit: {
            type: String,
            default: 'cover',
        },
    },
    setup(props: Props, { emit }) {
        // methods

        // 文件上传状态
        const imageClass = (file: File) => {
            return [
                `${prefixCls}-image`,
                {
                    [`${prefixCls}-preview`]:
                        props.previewFullImage && !currentStatus(file),
                },
            ];
        };

        // 有删除
        const isDeletable = (file: File) => {
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
        const fileStatusClass = (file: File) => {
            return [
                `${prefixCls}-status`,
                {
                    [`${prefixCls}-status-finish`]: file.status === 'finished',
                },
            ];
        };

        // 获取当前状态
        const currentStatus = (item: File) => {
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
        const handleRemove = (file: File, index: number) => {
            const item = file;
            const { name, beforeDelete } = props;

            // 拦截器
            callInterceptor({
                // 拦截参数
                interceptor: item.beforeDelete || beforeDelete,
                // 数据
                args: [item, { name, index }],
                done: () => emit('on-delete', file, index),
            });
        };

        // 返回文件数据
        const handleFileData = (file: File, index: number) => {
            emit('on-preview', file, index);
        };

        // 图片样式
        const imgStyle = (file: File) => {
            let obj = {};

            obj = {
                'object-fit': file.imageFit || props.imageFit,
            };

            return obj;
        };

        return {
            prefixCls,

            // methods
            imageClass,
            fileStatusClass,
            currentStatus,
            handleRemove,
            handleFileData,
            isImageFile,
            isDeletable,
            imgStyle,
            getSizeStyle,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
