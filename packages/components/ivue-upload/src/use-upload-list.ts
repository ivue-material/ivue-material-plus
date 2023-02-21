// hooks
import { callInterceptor } from '@ivue-material-plus/hooks';

// type
import type { SetupContext } from 'vue';
import type { UploaderFileListItem } from '@ivue-material-plus/hooks';
import type { UploadListProps, UploadListEmits } from './upload-list';

export const useUploadList = (
  props: UploadListProps,
  emit: SetupContext<UploadListEmits>['emit']
) => {
  // methods

  // 有删除
  const isDeletable = (file: UploaderFileListItem) => {
    // 自定义单个图片预览
    if (typeof file.deletable !== 'undefined') {
      if (file.deletable && file.status !== 'uploading') {
        return true;
      }
    }
    // 展示删除按钮 & 没有上传中
    else if (props.deletable && file.status !== 'uploading') {
      return true;
    }

    return false;
  };

  // 获取当前状态
  const currentStatus = (item: UploaderFileListItem) => {
    const { status } = item;

    // 上传中 || 上传失败
    if (status === 'uploading' || status === 'failed') {
      return true;
    }

    return false;
  };

  // 删除按钮
  const handleRemove = (file: UploaderFileListItem, index: number) => {
    const item = file;
    const { name, beforeDelete } = props;

    // 拦截器
    callInterceptor({
      // 拦截参数
      interceptor: item.beforeDelete || beforeDelete,
      // 数据
      args: [item, { name, index }],
      // 发送事件
      done: () => emit('on-delete', file, index),
    });
  };

  // 返回文件数据
  const handleFileData = (file: UploaderFileListItem, index: number) => {
    // 点击预览图时触发
    emit('on-preview', file, index);
  };

  return {
    // methods
    currentStatus,
    isDeletable,

    handleRemove,
    handleFileData,
  };
};
