/* eslint-disable */
import {
  createApp,
  h,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue';
import Modal from './index.vue';
import {
  isClient
} from '../../utils/helpers';

const prefixCls = 'ivu-modal-instance';

type iconType = 'success' | 'warning' | 'info' | 'error' | ''

Modal.newInstance = (properties) => {
  if (!isClient) {
    return;
  }

  const _props = properties || {};

  const container = document.createElement('div');
  document.body.appendChild(container);

  // 当前实例
  let _instance: ComponentInternalInstance | null = null;

  const Instance = createApp({
    data() {
      return Object.assign({}, _props, {
        /**
         * 显示/隐藏
         *
         * @type {Boolean}
         */
        visible: false,
        /**
         * 对话框宽度，对话框的宽度是响应式的，
         * 当屏幕尺寸小于 768px 时，宽度会变为自动auto。
         * 当其值不大于 100 时以百分比显示，大于 100 时为像素
         *
         * @type {Number | String}
         */
        width: 416,
        /**
         * 标题
         *
         * @type {String}
         */
        title: '',
        /**
         * 内容
         *
         * @type {String}
         */
        content: '',
        iconType: '',
        iconName: '',
        /**
         * 确定按钮文字
         *
         * @type {String}
         */
        confirmText: undefined,
        /**
         * 关闭文案
         *
         * @type {String}
         */
        cancelText: undefined,
        /**
         * 显示取消按钮
         *
         * @type {Boolean}
         */
        showCancel: false,
        /**
         * 点击确定按钮时，确定按钮是否显示 loading 状态，
         * 开启则需手动设置value来关闭对话框
         *
         * @type {Boolean}
         */
        loading: false,
        /**
         * 页面是否可以滚动
         *
         * @type {Boolean}
         */
        scrollable: false,
        /**
         * 是否显示关闭按钮
         *
         * @type {Boolean}
         */
        closable: false,
        /**
         * 关闭有动画，期间使用此属性避免重复点击
         *
         * @type {Boolean}
         */
        closing: false
      });
    },
    created() {
      _instance = getCurrentInstance();
    },
    methods: {
      // 点击取消的回调
      handleCancel() {
        // 关闭有动画，期间使用此属性避免重复点击
        if (this.closing) {
          return;
        }

        // 关闭弹窗
        this.$refs.modal.visible = false;

        // 取消loading
        this.$refs.modal.setLoading(false);

        // 点击取消的回调
        this.onCancel();
        // 删除实例
        this.remove();
      },
      // 点击确认
      onConfirm() { },
      // 点击取消的回调
      onCancel() { },
      // 删除实例
      onRemove() { }
    },
    render() {
      return h(Modal, {
        ..._props,
        // 对话框宽度
        width: this.width,
        // 页面是否可以滚动
        scrollable: this.scrollable,
        // 是否显示关闭按钮
        closable: this.closable,
        // ref
        ref: 'modal',
        // modelValue
        modelValue: this.visible,
        // 更新modelValue
        'onUpdate:modelValue': (status: boolean) => {
          this.visible = status;
        },
        // 点击取消的回调
        'onOn-cancel': this.handleCancel
      },
        () => h('div', {
          class: prefixCls
        }, [
          // head_render,
          // body_render,
          // h('div', {
          //   class: `${prefixCls}-footer`
          // }, footerVNodes)
        ])
      );
    }
  });


  Instance.mount(container);
  const modal: any = _instance.refs.modal;


  return {
    show(props: any) {
      // 显示取消按钮
      modal.$parent.showCancel = props.showCancel;
      // 图标类型
      modal.$parent.iconType = props.icon;

      switch (props.icon) {
        case 'info':
          modal.$parent.iconName = 'info';
          break;
        case 'success':
          modal.$parent.iconName = 'success';
          break;
        case 'warning':
          modal.$parent.iconName = 'warning';
          break;
        case 'error':
          modal.$parent.iconName = 'error';
          break;
        case 'confirm':
          modal.$parent.iconName = 'Help';
          break;
      }

      // 对话框宽度
      if ('width' in props) {
        modal.$parent.width = props.width;
      }

      // 是否显示关闭按钮
      if ('closable' in props) {
        modal.$parent.closable = props.closable;
      }

      // 标题
      if ('title' in props) {
        modal.$parent.title = props.title;
      }

      // 内容
      if ('content' in props) {
        modal.$parent.content = props.content;
      }

      // 确定按钮文字
      if ('confirmText' in props) {
        modal.$parent.confirmText = props.confirmText;
      }

      // 关闭文案
      if ('cancelText' in props) {
        modal.$parent.cancelText = props.cancelText;
      }

      // 点击取消的回调
      if ('onCancel' in props) {
        modal.$parent.onCancel = props.onCancel;
      }

      // 点击确认
      if ('onConfirm' in props) {
        modal.$parent.onConfirm = props.onConfirm;
      }

      // 异步加载 触发 确认
      if ('loading' in props) {
        modal.$parent.loading = props.loading;
      }

      // 页面是否可以滚动
      if ('scrollable' in props) {
        modal.$parent.scrollable = props.scrollable;
      }

      // 当组件销毁时通知
      modal.$parent.onRemove = props.onRemove;

      // 显示
      modal.visible = true;

      console.log( modal.$parent.$refs.modal)
    },
    remove() {
      modal.visible = false;
      modal.$parent.buttonLoading = false;
      modal.$parent.remove();

      // 取消loading
      // this.$refs.modal.setLoading(false);
    },
    component: modal
  };
};



export default Modal;
