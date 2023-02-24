<template>
  <div :class="bem.b()">
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
        :accept="accept"
        :multiple="multiple"
        :capture="capture"
        @change="handleChange"
        v-if="!readonly"
      />
      <slot>
        <div :class="inputContentClasses" :style="getSizeStyle(previewSize)">
          <!-- 图标 -->
          <ivue-icon :class="bem.be('content', 'icon')">cloud_upload</ivue-icon>
          <!-- 文案 -->
          <p :class="bem.be('content', 'text')">点击上传</p>
        </div>
      </slot>
    </div>

    <!-- 列表 -->
    <upload-list
      :files="fileList"
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
      :previewList="imagePreviewList"
      :initialIndex="imagePreviewInitialIndex"
      v-model="imagePreview"
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
        :accept="accept"
        :multiple="multiple"
        :capture="capture"
        @change="handleChange"
        v-if="!readonly"
      />
      <slot>
        <div :class="inputContentClasses" :style="getSizeStyle(previewSize)">
          <!-- 图标 -->
          <ivue-icon :class="bem.be('content', 'icon')">cloud_upload</ivue-icon>
          <!-- 文案 -->
          <p :class="bem.be('content', 'text')">点击上传</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref, watch } from 'vue';

// hooks
import { useNamespace } from '@ivue-material-plus/hooks';
// utils
import { getSizeStyle } from '@ivue-material-plus/utils';
// upload
import { uploadProps, uploadEmits } from './upload';
// use-upload
import { useUpload } from './use-upload';

// components
import { IvueIcon } from '@ivue-material-plus/components';
import ImagePreview from '@ivue-material-plus/components/ivue-image-preview';
import UploadList from './upload-list.vue';

const prefixCls = 'ivue-upload';

export default defineComponent({
  name: prefixCls,
  emits: uploadEmits,
  props: uploadProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
      // dom
      input,

      // data
      dragOver,
      fileList,
      imagePreview,
      imagePreviewList,
      imagePreviewInitialIndex,

      // methods
      handleClickInput,
      handleDrag,
      handleDragOver,
      handleDragleave,
      handleChange,
      handleRemove,
      handlePreview,
      handleClosePreview,
      uploadFiles,
    } = useUpload(props, emit);

    // computed

    // 上传框左边
    const inputWrapClasses = computed(() => {
      return [
        {
          [bem.b('select')]: props.type === 'select',
        },
      ];
    });

    const inputContentClasses = computed(() => {
      return [
        bem.b('content'),
        {
          // 只读
          [bem.is('readonly')]: props.readonly,
          // 禁用
          [bem.is('disabled')]: props.disabled,
          // 拖动
          [bem.is('drag')]: props.type === 'drag',
          [bem.is('dragOver')]: props.type === 'drag' && unref(dragOver),
        },
      ];
    });

    // 判断图片上传数量
    const renderUpload = computed(() => {
      if (props.modelValue.length >= props.maxCount || !props.showUpload) {
        return false;
      }

      return true;
    });

    // 监听数据变化
    watch(
      () => props.modelValue,
      (value) => {
        fileList.value = value;
      }
    );

    return {
      bem,

      // dom
      input,

      // data
      fileList,
      imagePreview,
      imagePreviewList,
      imagePreviewInitialIndex,

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
      handleClosePreview,

      // 获取大小样式
      getSizeStyle,
    };
  },
  components: {
    UploadList,
    IvueIcon,
    ImagePreview,
  },
});
</script>
