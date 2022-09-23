import Modal from './instance';

// ts
import type ModalInstance from './index.vue';

export type Instance = InstanceType<typeof ModalInstance>

let modalInstance: Instance;

function getModalInstance(render = undefined, lockScroll = true) {
  modalInstance = modalInstance || Modal.newInstance({
    // 是否显示关闭按钮
    closable: false,
    // 是否允许点击遮罩层关闭
    maskClosable: false,
    // 不显示底部
    footerHide: true,
    // 渲染函数
    render: render,
    // 是否禁止对页面滚动条的修改
    lockScroll
  });

  return modalInstance;
}

// 渲染实例
function renderInstance(options) {
  // 自定义内容，使用后不再限制类型， content 也无效
  const render = ('render' in options) ? options.render : undefined;
  // 是否禁止对页面滚动条的修改
  const lockScroll = ('lockScroll' in options) ? options.lockScroll : true;

  // 创建实例
  const instance: any = getModalInstance(render, lockScroll);

  options.onRemove = function () {
    modalInstance = null;
  };

  // eslint-disable-next-line no-console
  console.log('instance', instance);
  instance.show(options);
}

// 信息
Modal.info = (props: Record<string, any> = {}) => {
  props.icon = 'info';
  props.showCancel = false;

  return renderInstance(props);
};

export default Modal;
