import { createApp, h, getCurrentInstance } from 'vue';

// helpers
import { isClient } from '@ivue-material-plus/utils/helpers';

import ImagePreview from './image-preview.vue';

// type
import type { ComponentInternalInstance } from 'vue';
import type { ImagePreviewProps } from './image-preview';

export type ShowOptions = {
  removeInstance?: () => void;
};

ImagePreview.newInstance = (properties: ImagePreviewProps) => {
  if (!isClient) {
    return;
  }

  const _props = properties || {};

  let _instance: ComponentInternalInstance;

  // 创建实例
  const Instance = createApp({
    data() {
      return Object.assign({}, _props, {
        /**
         * 显示
         *
         * @type {Boolean}
         */
        visible: false,
        /**
         * 图片预览列表
         *
         * @type {Array}
         */
        previewList: [],
        /**
         * 打开预览的第一项
         *
         * @type {Number}
         */
        initialIndex: 0,
        /**
         * 图片预览操作栏选项，按数组顺序排序
         *
         * @type {Array}
         */
        toolbar: [
          'zoomIn',
          'zoomOut',
          'original',
          'rotateLeft',
          'rotateRight',
          'download',
        ],
        /**
         * 是否循环切换
         *
         * @type {Boolean}
         */
        infinite: true,
        /**
         * 是否允许点击遮罩层关闭
         *
         * @type {Boolean}
         */
        maskClosable: true,
        /**
         * 是否将弹层放置于 body 内
         *
         * @type {Boolean}
         */
        transfer: true,
      });
    },
    created() {
      _instance = getCurrentInstance() as ComponentInternalInstance;
    },
    methods: {
      // 关闭弹窗
      handleClose() {
        this.visible = false;

        setTimeout(() => {
          this.destroy();
          this.removeInstance();
        }, 300);
      },
      // 注销实例
      destroy() {
        // 注销实例
        Instance.unmount();

        document.body.removeChild(container);
      },
      // 删除实例
      removeInstance() {},
    },
    render() {
      return h(
        ImagePreview,
        Object.assign({}, _props, {
          ref: 'imagePreview',
          modelValue: this.visible,
          previewList: this.previewList,
          initialIndex: this.initialIndex,
          toolbar: this.toolbar,
          infinite: this.infinite,
          maskClosable: this.maskClosable,
          transfer: this.transfer,
          'onOn-close': this.handleClose,
        })
      );
    },
  });

  // 挂载实例到dom
  const container = document.createElement('div');
  document.body.appendChild(container);
  Instance.mount(container);

  // 获取当前节点
  const imagePreview = _instance!.refs.imagePreview as any;

  return {
    show(options: ShowOptions) {
      // 导入props
      (Object.keys(options) as Array<keyof typeof options>).forEach((key) => {
        imagePreview.$parent[key] = options[key];
      });

      // 显示预览
      imagePreview.$parent.visible = true;
    },
    component: imagePreview,
  };
};

export default ImagePreview;
