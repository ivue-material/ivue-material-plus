import { createVNode, VNode, render, isVNode } from 'vue';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

import Message from './index.vue';


type MessageVM = VNode

type MessageQueueItem = {
  vm: MessageVM
}

type MessageQueue = Array<MessageQueueItem>

type MessageType = 'success' | 'warning' | 'info' | 'error' | ''

type options = {
  content?: string,
  offset?: number,
  onClose?: () => any,
  type?: MessageType,
  id?: string,
  zIndex?: number,
}


// 实例列表
const instances: MessageQueue = [];

let name = 1;
const prefixKey = 'ivue_message_key_';

const message = (type, options: options) => {

    // 纯字符串
    if (typeof options === 'string') {
        options = {
            content: options,
        };
    }

    // 距离顶部位置
    let verticalOffset = options.offset || 20;

    // 遍历实例累加位移位置
    instances.forEach(({ vm }) => {
        verticalOffset += (vm.el.offsetHeight || 0) + 16;
    });

    // 每一个累加
    verticalOffset += 16;

    console.log(verticalOffset);

    // 每一个的id
    const id = `${prefixKey}${name++}`;
    // 用户设置的关闭回调
    const userOnClose = options.onClose;

    // 获取Index
    const handleGetIndex = () => {
        transferIncrease();
        return transferIndex;
    };

    // 当前index
    const tIndex = handleGetIndex();

    // 设置选项
    options = {
    // default options end
        ...options,
        type,
        onClose: () => {
            close(id, userOnClose);
        },
        offset: verticalOffset,
        id: id,
        zIndex: 1010 + tIndex,
    };


    // 实例对象
    const vm: VNode = createVNode(
        Message,
        options,
        isVNode(options.content) ?
            { default: () => message } :
            null);

    const container = document.createElement('div');

    // 清除通知元素防止内存泄漏
    vm.props.onDestroy = () => {
    // 既然元素被销毁了，那么VNode也应该被GC回收
    // 我们不想造成任何内存泄漏，因为我们已经返回 vm 作为对用户的引用
    // 以便我们手动将其设置为 false。
        render(null, container);
    };

    render(vm, container);

    // 当 close 函数被调用时，实例将删除此项。 所以我们不需要担心。
    instances.push({ vm });
    document.body.appendChild(container.firstElementChild);
};

// 关闭
const close = (id: string, userOnClose?: (vm: MessageVM) => void): void => {


};

export default {
    info(options) {
        message('info', options);
    },
};
