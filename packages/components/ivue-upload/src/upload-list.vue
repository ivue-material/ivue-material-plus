<template>
  <ul :class="bem.b()">
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
            :class="bem.be('image', 'img')"
            :style="imgStyle(file)"
          />

          <!-- 自定义预览图片区域内容 -->
          <div :class="bem.be('image', 'preview')">
            <slot name="preview-image">
              <!-- 预览图标 -->
              <ivue-icon>visibility</ivue-icon>
            </slot>
          </div>
        </div>
        <!-- 蒙层 -->
        <transition name="fade">
          <div :class="bem.b('mask')" v-if="currentStatus(file)">
            <!-- 加载中 -->
            <div
              :class="bem.bm('mask', 'loading')"
              v-ivue-loading="file.status === 'uploading'"
              v-if="file.status === 'uploading'"
            ></div>
            <!-- 错误图标 -->
            <template v-if="file.status === 'failed'">
              <ivue-icon :class="bem.be('mask', 'icon')" v-if="!failedIcon">
                cancel
              </ivue-icon>
              <i :class="[bem.be('mask', 'icon'), failedIcon]" v-else></i>
            </template>
            <!-- 描述的信息 -->
            <div :class="bem.be('mask', 'message')" v-if="file.message">
              {{ file.message }}
            </div>
          </div>
        </transition>
        <!-- 删除按钮 -->
        <ivue-icon
          :class="bem.b('remove')"
          @click.stop="handleRemove(file, index)"
          v-if="isDeletable(file)"
          >close</ivue-icon
        >
        <!-- 自定义覆盖在预览区域上方的内容 -->
        <template v-if="$slots['preview-cover']">
          <slot name="preview-cover" :file="file"></slot>
        </template>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// utils
import { isImageFile, getSizeStyle } from '@ivue-material-plus/utils';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';
// upload-lists
import { uploadListProps, uploadListEmits } from './upload-list';
// use-upload-list
import { useUploadList } from './use-upload-list';

// components
import { IvueLoadingDirective } from '@ivue-material-plus/components/ivue-loading';
import IvueIcon from '@ivue-material-plus/components/ivue-icon';

// type
import type { CSSProperties } from 'vue';
import type { UploaderFileListItem } from '@ivue-material-plus/hooks';

const prefixCls = 'ivue-upload-list';

export default defineComponent({
  name: prefixCls,
  directives: {
    IvueLoading: IvueLoadingDirective,
  },
  emits: uploadListEmits,
  props: uploadListProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
      // methods
      currentStatus,
      isDeletable,
      handleRemove,
      handleFileData,
    } = useUploadList(props, emit);

    // methods

    // 文件上传状态
    const imageClass = (file: UploaderFileListItem) => {
      return [
        bem.b('image'),
        {
          [bem.is('preview')]: props.previewFullImage && !currentStatus(file),
        },
      ];
    };

    // 文件上传状态
    const fileStatusClass = (file: UploaderFileListItem) => {
      return [
        bem.b('status'),
        {
          [bem.is('finish')]: file.status === 'finished',
        },
      ];
    };

    // 图片样式
    const imgStyle = (file: UploaderFileListItem): CSSProperties => {
      return {
        'object-fit': file.imageFit || props.imageFit,
      };
    };

    return {
      // bem
      bem,

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
