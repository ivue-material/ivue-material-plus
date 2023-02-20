import { ref, reactive, unref } from 'vue';

// utils
import { isPromise } from '@ivue-material-plus/utils';

import {
  readFileContent,
  isOversize,
  filterFiles,
  toArray,
} from '@ivue-material-plus/hooks';

// type
import type { SetupContext } from 'vue';
import type { UploaderFileListItem } from '@ivue-material-plus/hooks';
import type { UploadProps, UploadEmits } from './upload';

export const useUpload = (
  props: UploadProps,
  emit: SetupContext<UploadEmits>['emit']
) => {
  // dom
  const input = ref<HTMLInputElement>();

  // 当前选择状态
  const fileList = ref<UploaderFileListItem[]>(props.modelValue);
  // 拖动是否完成
  const dragOver = ref<boolean>(false);
  // 图片预览
  const imagePreview = ref<boolean>(false);
  // 图片预览列表
  const imagePreviewList = ref<string[]>([]);
  // 图片预览下标
  const imagePreviewInitialIndex = ref<number>(0);

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

    input.value!.click();
  };

  // 拖动
  const handleDrag = (e: DragEvent) => {
    dragOver.value = false;

    // 获取拖动的文件
    const files = e.dataTransfer!.files;
    const file =
      files.length === 1
        ? (files[0] as File)
        : ([].slice.call(files) as File[]);

    // 只上传文件
    if (files.length === 1) {
      // 接受的上传类型
      if (props.dragAccept) {
        const name = (file as File).name.replace(/.*\./g, '').toLowerCase();

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
      const arr = [] as File[];
      const errArr = [] as File[];

      (file as File[]).forEach((item) => {
        // 接受的上传类型
        if (props.dragAccept) {
          const name = item.name.replace(/.*\./g, '').toLowerCase();

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

      // 拖动文件上传错误时触发，返回上传错误的文件
      if (errArr.length === 0) {
        emit('on-drag-upload-error', errArr);
      }
      // 获取上传文件
      else {
        uploadFiles(arr);
      }
    }
  };

  // 拖动进入
  const handleDragOver = () => {
    dragOver.value = true;
  };

  // 拖动离开
  const handleDragleave = () => {
    dragOver.value = false;
  };

  // 输入框数据改变
  const handleChange = (event: Event) => {
    const { files } = event.target as HTMLInputElement;

    if (!files) {
      return;
    }

    const file =
      files.length === 1 ? files[0] : ([].slice.call(files) as File[]);

    // 文件读取前的回调函数
    if (props.beforeRead) {
      const response = props.beforeRead(file, getDetail());

      // 没有会调重置输入框
      if (!response) {
        resetInput();
        return;
      }

      // isPromise
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

        // 文件大小超过限制时触发
        emit('on-oversize', result.invalid, getDetail());

        if (!items.length) {
          return;
        }
      } else {
        // 文件大小超过限制时触发
        emit('on-oversize', items, getDetail());

        return;
      }
    }

    items = reactive(items);

    // modelValue
    emit('update:modelValue', [...props.modelValue, ...toArray(items)]);

    // 文件读取完成后的回调函数
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
  const handleRemove = (file: UploaderFileListItem, index: number) => {
    fileList.value = unref(fileList).splice(index, 1);

    // modelValue
    emit('update:modelValue', unref(fileList));
    // 删除文件预览时触发
    emit('on-delete', file, getDetail(index));
  };

  // 查看图片
  const handlePreview = (file: UploaderFileListItem, index: number) => {
    // 点击预览图时触发
    emit('on-preview', file);

    // 是否在点击预览图后展示全屏图片预览
    if (props.previewFullImage) {
      imagePreviewList.value = [...props.modelValue].map((item) => {
        return item.url || item.content;
      }) as string[];

      // 传入了预览图片开始位置下标
      if (props.previewImageInitialIndex !== -1) {
        imagePreviewInitialIndex.value = props.previewImageInitialIndex;
      }
      // 默认预览图片开始位置下标
      else {
        imagePreviewInitialIndex.value = index;
      }

      // 图片预览
      imagePreview.value = true;
    }
  };

  // 关闭全屏图片预览时触发
  const handleClosePreview = () => {
    emit('on-close-preview');
  };

  return {
    // dom
    input,

    // data
    dragOver,
    imagePreview,
    imagePreviewList,
    imagePreviewInitialIndex,
    fileList,

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
  };
};
