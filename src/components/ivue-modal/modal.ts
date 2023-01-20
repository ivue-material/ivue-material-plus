import Modal from './instance';

// types
import type ModalInstance from './index.vue';

export type ModalInstance = InstanceType<typeof ModalInstance>;

type Options = {
  render?: () => void;
  onRemove?: () => void;
  lockScroll?: any;
  icon?: string;
  showCancel?: boolean;
};

type Props = {
  icon?: string;
  showCancel?: boolean;
};

// instance
let modalInstance: ModalInstance;

function getModalInstance(render = undefined, lockScroll = true): any {
  modalInstance =
    modalInstance ||
    Modal.newInstance({
      // 是否显示关闭按钮
      closable: false,
      // 是否允许点击遮罩层关闭
      maskClosable: false,
      // 不显示底部
      footerHide: true,
      // 渲染函数
      render: render,
      // 是否禁止对页面滚动条的修改
      lockScroll,
    });

  return modalInstance;
}

// 渲染实例
function renderInstance(options: Options) {
  // 自定义内容，使用后不再限制类型， content 也无效
  const render = 'render' in options ? options.render : undefined;
  // 是否禁止对页面滚动条的修改
  const lockScroll = 'lockScroll' in options ? options.lockScroll : true;

  // 创建实例
  const instance = getModalInstance(render, lockScroll);

  // 删除实例
  options.onRemove = function () {
    modalInstance = null;
  };

  // 显示弹窗
  instance.show(options);
}

// 信息
Modal.info = (props: Props = {}) => {
  props.icon = 'info';
  props.showCancel = false;

  return renderInstance(props);
};

// 成功
Modal.success = (props: Props = {}) => {
  props.icon = 'success';
  props.showCancel = false;

  return renderInstance(props);
};

// 警告
Modal.warning = (props: Props = {}) => {
  props.icon = 'warning';
  props.showCancel = false;

  return renderInstance(props);
};

// 失败
Modal.error = (props: Props = {}) => {
  props.icon = 'error';
  props.showCancel = false;

  return renderInstance(props);
};

// 确认弹窗
Modal.confirm = (props: Props = {}) => {
  props.icon = 'confirm';
  props.showCancel = true;

  return renderInstance(props);
};

// 删除实例
Modal.remove = () => {
  // 在加载状态，取消后删除
  if (!modalInstance) {
    return false;
  }

  const instance = getModalInstance();

  instance.remove();
};

export default Modal;
