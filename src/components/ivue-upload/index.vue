<template>
    <div :class="prefixCls">
        <!-- 上传框左边 -->
        <div
            :class="inputWrapClasses"
            @click="handleClickInput"
            @drop.prevent="handleDrag"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragleave"
            v-if="uploadDirection === 'left'"
            v-show="renderUpload"
        >
            <input
                type="file"
                ref="input"
                :class="`${prefixCls}-input`"
                :accept="accept"
                :multiple="multiple"
                :capture="capture"
                @change="handleChange"
                v-if="!readonly"
            />
            <slot>
                <div :class="inputContentClasses" :style="getSizeStyle(previewSize)">
                    <!-- 图标 -->
                    <ivue-icon :class="`${prefixCls}-content__icon`">cloud_upload</ivue-icon>
                    <p :class="`${prefixCls}-content__text`">点击上传</p>
                </div>
            </slot>
        </div>

        <!-- 列表 -->
        <upload-list
            :files="data.fileList"
            :failedIcon="failedIcon"
            :deletable="deletable"
            :name="name"
            :previewSize="previewSize"
            :beforeDelete="beforeDelete"
            :previewFullImage="previewFullImage"
            :imageFit="imageFit"
            @on-delete="handleRemove"
            @on-preview="handlePreview"
            v-if="previewImage"
        >
            <!-- 自定义覆盖在预览区域上方的内容 -->
            <template v-if="$slots['preview-cover']" #preview-cover="{ file }">
                <slot name="preview-cover" :file="file"></slot>
            </template>
            <!-- 自定义预览图片区域内容 -->
            <template v-if="$slots['preview-image']" #preview-image>
                <slot name="preview-image"></slot>
            </template>
        </upload-list>

        <!-- 放大图片 -->
        <image-preview
            transfer
            :bodyOverflow="bodyOverflow"
            :previewList="data.imagePreviewList"
            :initialIndex="data.imagePreviewInitialIndex"
            v-model="data.imagePreview"
            @on-close="handleClosePreview"
        ></image-preview>

        <!-- 上传框右边 -->
        <div
            :class="inputWrapClasses"
            @click="handleClickInput"
            @drop.prevent="handleDrag"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragleave"
            v-if="uploadDirection === 'right'"
            v-show="renderUpload"
        >
            <input
                type="file"
                ref="input"
                :class="`${prefixCls}-input`"
                :accept="accept"
                :multiple="multiple"
                :capture="capture"
                @change="handleChange"
                v-if="!readonly"
            />
            <slot>
                <div :class="inputContentClasses" :style="getSizeStyle(previewSize)">
                    <!-- 图标 -->
                    <ivue-icon :class="`${prefixCls}-content__icon`">cloud_upload</ivue-icon>
                    <p :class="`${prefixCls}-content__text`">点击上传</p>
                </div>
            </slot>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed, ref, reactive, PropType, watch } from 'vue';

import IvueIcon from '../ivue-icon/index.vue';
import UploadList from './upload-list.vue';
import ImagePreview from '../ivue-image-preview';

import { oneOf } from '../../utils/assist';
import { isPromise } from '../../utils/validate';
import { Interceptor } from '../../utils/interceptor';

import {
    readFileContent,
    isOversize,
    UploaderFileListItem,
    UploaderResultType,
    UploaderMaxSize,
    filterFiles,
    toArray,
    getSizeStyle,
} from '../../utils/helpers';

// type
import {
    Props,
    Data,
    UploaderAfterRead,
    UploaderBeforeRead,
} from './types/upload';

const prefixCls = 'ivue-upload';

export default defineComponent({
    name: prefixCls,
    emits: [
        'update:modelValue',
        'on-oversize',
        'on-delete',
        'on-preview',
        'on-drag-upload-error',
        'on-close-preview',
    ],
    props: {
        /**
         * 上传组件类型
         *
         * @type {String}
         *
         * select (点击选择)
         *
         * drag (支持拖动)
         */
        type: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['select', 'drag']);
            },
            default: 'select',
        },
        /**
         * 接受的上传类型
         *
         * @type {String}
         */
        accept: {
            type: String,
            default: 'image/*',
        },
        /**
         * 拖拽接受的上传类型后缀
         *
         * @type {Array}
         */
        dragAccept: {
            type: Array,
        },
        /**
         * 是否支持多选文件
         *
         * @type {Boolean}
         */
        multiple: {
            type: Boolean,
            default: false,
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
         * 是否将上传区域设置为只读状态
         *
         * @type {Boolean}
         */
        readonly: {
            type: Boolean,
            default: false,
        },
        /**
         * 图片选取模式，可选值为 camera (直接调起摄像头)
         *
         * @type {String}
         */
        capture: {
            type: String as PropType<any>,
        },
        /**
         * 文件读取结果类型，可选值为 file text dataUrl url
         *
         * @type {String}
         */
        resultType: {
            type: String as PropType<UploaderResultType>,
            default: 'dataUrl',
        },
        /**
         * 返回的数据
         *
         * @type {Array}
         */
        modelValue: {
            type: Array as PropType<UploaderFileListItem[]>,
            default: () => [],
        },
        /**
         * 文件大小限制，单位为 byte
         *
         * @type {number | string | (file: File) => boolean}
         */
        maxSize: {
            type: [Number, String, Function] as PropType<UploaderMaxSize>,
            default: Number.MAX_VALUE,
        },
        /**
         * 文件上传数量限制
         *
         * @type {Number, String}
         */
        maxCount: {
            type: [Number, String],
            default: Number.MAX_VALUE,
        },
        /**
         * 文件读取完成后的回调函数
         *
         * @type {Boolean}
         */
        afterRead: {
            type: Function as PropType<UploaderAfterRead>,
        },
        /**
         * before-read	文件读取前的回调函数，返回 false 可终止文件读取，支持返回 Promise
         *
         * @type {Function}
         */
        beforeRead: {
            type: Function as PropType<UploaderBeforeRead>,
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
            default: true,
        },
        /**
         * 是否展示上传区域
         *
         * @type {Boolean}
         */
        showUpload: {
            type: Boolean,
            default: true,
        },
        /**
         * 预览图和上传区域的尺寸，默认单位为 px
         *
         * @type {Number | String}
         */
        previewSize: [Number, String],
        /**
         * 是否在上传完成后展示预览图
         *
         * @type {Boolean}
         */
        previewImage: {
            type: Boolean,
            default: true,
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
         * 预览图片放大
         *
         * @type {Boolean}
         */
        previewFullImage: {
            type: Boolean,
            default: true,
        },
        /**
         * 预览图片开始位置下标
         *
         * @type {Boolean}
         */
        previewImageInitialIndex: {
            type: Number,
            default: -1,
        },
        /**
         * 防止body滚动
         *
         * @type {Boolean}
         */
        bodyOverflow: {
            type: Boolean,
            default: true,
        },
        /**
         * 上传方向
         *
         * @type {String}
         */
        uploadDirection: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['left', 'right']);
            },
            default: 'right',
        },
        /**
         * 预览图裁剪模式
         *
         * @type {String}
         */
        imageFit: {
            type: String,
            validator(value: string) {
                return oneOf(value, [
                    'contain',
                    'cover',
                    'fill',
                    'none',
                    'scale-down',
                ]);
            },
            default: 'cover',
        },
    },
    setup(props: Props, { emit }) {
        // dom
        const input = ref(null);

        // data
        const data = reactive<Data>({
            /**
             * 当前选择状态
             *
             * @type {Array}
             */
            fileList: props.modelValue,
            /**
             * 拖动是否完成
             *
             * @type {Boolean}
             */
            dragOver: false,
            /**
             * 图片预览
             *
             * @type {Boolean}
             */
            imagePreview: false,
            /**
             * 图片预览列表
             *
             * @type {Array}
             */
            imagePreviewList: [],
            /**
             * 图片预览下标
             *
             * @type {Number}
             */
            imagePreviewInitialIndex: 0,
        });

        // computed

        const inputWrapClasses = computed(() => {
            return [
                {
                    [`${prefixCls}-select`]: props.type === 'select',
                },
            ];
        });

        const inputContentClasses = computed(() => {
            return [
                {
                    [`${prefixCls}-content`]: true,
                    [`${prefixCls}-readonly`]: props.readonly,
                    [`${prefixCls}-disabled`]: props.disabled,
                    [`${prefixCls}-drag`]: props.type === 'drag',
                    [`${prefixCls}-dragOver`]:
                        props.type === 'drag' && data.dragOver,
                },
            ];
        });

        // 判断图片上传数量
        const renderUpload = computed(() => {
            if (
                props.modelValue.length >= props.maxCount ||
                !props.showUpload
            ) {
                return false;
            }

            return true;
        });

        // methods

        // 点击输入框
        const handleClickInput = () => {
            if (props.disabled || props.readonly) {
                return;
            }

            // 剩余数量
            const remainCount = +props.maxCount - props.modelValue.length;

            // 到达限制数量禁止上传
            if (remainCount === 0) {
                return;
            }

            input.value.click();
        };

        // 拖动
        const handleDrag = (e: DragEvent) => {
            data.dragOver = false;

            const files = e.dataTransfer.files;
            const file = files.length === 1 ? files[0] : [].slice.call(files);

            // 只上传文件
            if (files.length === 1) {
                // 接受的上传类型
                if (props.dragAccept) {
                    const name = file.name.replace(/.*\./g, '').toLowerCase();

                    const findIndex = props.dragAccept.findIndex(
                        (accept) => accept === name
                    );

                    if (findIndex > -1) {
                        uploadFiles(file);
                    }
                    // 上传错误提示
                    else {
                        emit('on-drag-upload-error', file);
                    }
                }
                // 没有限制
                else {
                    uploadFiles(file);
                }
            }
            // 多个文件上传
            else {
                const arr = [];
                const errArr = [];

                file.forEach((item) => {
                    // 接受的上传类型
                    if (props.dragAccept) {
                        const name = item.name
                            .replace(/.*\./g, '')
                            .toLowerCase();

                        const findIndex = props.dragAccept.findIndex(
                            (accept) => accept === name
                        );

                        if (findIndex > -1) {
                            arr.push(item);
                        }
                        // 错误文件
                        else {
                            errArr.push(item);
                        }
                    } else {
                        arr.push(item);
                    }
                });

                // 多选
                if (errArr.length === 0) {
                    emit('on-drag-upload-error', errArr);
                } else {
                    uploadFiles(arr);
                }
            }
        };

        // 拖动进入
        const handleDragOver = () => {
            data.dragOver = true;
        };

        // 拖动离开
        const handleDragleave = () => {
            data.dragOver = false;
        };

        // 输入框数据改变
        const handleChange = (event) => {
            const { files } = event.target as HTMLInputElement;

            if (!files) {
                return;
            }

            const file =
                files.length === 1
                    ? files[0]
                    : ([].slice.call(files) as File[]);

            // 文件读取前的回调函数
            if (props.beforeRead) {
                const response = props.beforeRead(file, getDetail());

                // 没有会调重置输入框
                if (!response) {
                    resetInput();
                    return;
                }

                if (isPromise(response)) {
                    response
                        .then((data) => {
                            if (data) {
                                uploadFiles(data);
                            } else {
                                uploadFiles(file);
                            }
                        })
                        .catch(resetInput);
                    return;
                }
            }

            // 获取上传文件
            uploadFiles(file);
        };

        // 获取上传文件
        const uploadFiles = (files: File | File[]) => {
            // 多个文件
            if (Array.isArray(files)) {
                // 剩余数量
                const remainCount = +props.maxCount - props.modelValue.length;

                if (files.length > remainCount) {
                    files = files.slice(0, remainCount);
                }

                // 表示文件读取结果的类型
                Promise.all(
                    files.map((file) => readFileContent(file, props.resultType))
                ).then((contents) => {
                    const fileList = (files as File[]).map((file, index) => {
                        const result: UploaderFileListItem = {
                            file,
                            status: '',
                            message: '',
                        };

                        if (contents[index]) {
                            result.content = contents[index] as string;
                        }

                        return result;
                    });

                    // 文件读取完成后的回调函数
                    onAfterRead(fileList);
                });
            }
            // 单个文件
            else {
                // 读取文件数据
                readFileContent(files, props.resultType).then((content) => {
                    const result: UploaderFileListItem = {
                        file: files as File,
                        status: '',
                        message: '',
                    };

                    if (content) {
                        result.content = content;
                    }

                    // 文件读取完成后的回调函数
                    onAfterRead(result);
                });
            }
        };

        // 文件读取完成后的回调函数
        const onAfterRead = (
            items: UploaderFileListItem | UploaderFileListItem[]
        ) => {
            // 清除输入框数据
            resetInput();

            if (isOversize(items, props.maxSize)) {
                if (Array.isArray(items)) {
                    const result = filterFiles(items, props.maxSize);
                    items = result.valid;

                    emit('on-oversize', result.invalid, getDetail());

                    if (!items.length) {
                        return;
                    }
                } else {
                    emit('on-oversize', items, getDetail());
                    return;
                }
            }

            items = reactive(items);

            // emit('update:modelValue', [...props.modelValue, ...toArray(items)]);
            emit(
                'update:modelValue',
                [].concat(props.modelValue, toArray(items))
            );

            if (props.afterRead) {
                props.afterRead(items, getDetail());
            }
        };

        // 清除输入框数据
        const resetInput = () => {
            if (input.value) {
                input.value.value = '';
            }
        };

        // 获取详情
        const getDetail = (index = props.modelValue.length) => ({
            name: props.name,
            index,
        });

        // 删除函数
        const handleRemove = (file: File, index: number) => {
            data.fileList.splice(index, 1);

            emit('update:modelValue', data.fileList);
            emit('on-delete', file, getDetail(index));
        };

        // 查看图片
        const handlePreview = (file: File, index: number) => {
            emit('on-preview', file);

            if (props.previewFullImage) {
                data.imagePreviewList = [...props.modelValue].map((item) => {
                    return item.url || item.content;
                });

                // 传入了预览图片开始位置下标
                if (props.previewImageInitialIndex !== -1) {
                    data.imagePreviewInitialIndex =
                        props.previewImageInitialIndex;
                }
                // 默认预览图片开始位置下标
                else {
                    data.imagePreviewInitialIndex = index;
                }

                data.imagePreview = true;
            }
        };

        // 关闭全屏图片预览时触发
        const handleClosePreview = () => {
            emit('on-close-preview');
        };

        // 监听数据变化
        watch(
            () => props.modelValue,
            (value) => {
                data.fileList = value;
            }
        );

        return {
            prefixCls,

            // data
            data,

            // dom
            input,

            // computed
            inputWrapClasses,
            inputContentClasses,
            renderUpload,

            // methods
            handleClickInput,
            handleDrag,
            handleDragOver,
            handleDragleave,
            handleChange,
            handleRemove,
            handlePreview,
            uploadFiles,
            getSizeStyle,
            handleClosePreview,
        };
    },
    components: {
        UploadList,
        IvueIcon,
        ImagePreview,
    },
});
</script>
