import { createVNode, VNode, render, isVNode, ComponentPublicInstance } from 'vue';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

import Message from './index.vue';


type MessageType = 'success' | 'warning' | 'info' | 'error' | ''

type options = {
    content?: string,
    offset?: number,
    onClose?: () => any,
    type?: MessageType,
    duration?: number,
    id?: string,
    zIndex?: number,
    loadingIcon?: string
}


// 实例列表
const instances: any = [];

let name = 1;
let offset;
let defaultDuration;

const prefixKey = 'ivue_message_key_';

const message = (type, options: options) => {

    // 纯字符串
    if (typeof options === 'string') {
        options = {
            content: options,
        };
    }

    // 距离顶部位置
    let verticalOffset = offset || options.offset || 20;

    // 遍历实例累加位移位置
    instances.forEach(({ vm }: any) => {
        verticalOffset += (vm.el.offsetHeight || 0) + 16;
    });

    // 每一个累加
    verticalOffset += 16;

    // duration
    options.duration = defaultDuration || options.duration;

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
    const vm: any = createVNode(
        Message,
        options,
        isVNode(options.content) ?
            { default: () => message } :
            null);

    const container = document.createElement('div') as HTMLElement;

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

    document.body.appendChild(container.firstElementChild as HTMLElement);
};


/**
  * 当用户点击`x` 按钮 或时间达到其限制时，将调用此函数。
  * 由transition@before-leave 事件发出，以便我们可以获取当前的notification.offsetHeight，如果它被调用
  * 通过@after-leave DOM 元素将从页面中删除，因此我们无法再获取 offsetHeight。
  * @param {String} id 要关闭的通知 id
  * @param {Position} 定位定位策略
  * @param {Function} userOnClose 用户关闭时调用的回调
  */
const close = (
    id: string,
    userOnClose?: (vm: VNode) => void,
): void => {
    // 将 vm 插入通知列表时存储索引
    const orientedNotifications = instances;

    // 当前的下标
    const idx = orientedNotifications.findIndex(({ vm }) => vm.component.props.id === id);

    if (idx === -1) {
        return;
    }

    // vm
    const { vm } = orientedNotifications[idx];

    if (!vm) return;

    // 在通知从 DOM 中移除之前调用用户的关闭函数。
    userOnClose?.(vm);

    // 请注意，这称为@before-leave，这就是我们能够获取此属性的原因。
    const removedHeight = vm.el.offsetHeight;

    orientedNotifications.splice(idx, 1);
    const len = orientedNotifications.length;

    if (len < 1) return;

    // 开始移除项
    for (let i = idx; i < len; i++) {
        // 新位置等于当前的 offsetTop 减去移除的高度加上 16px（每个项目之间的间隙大小）
        const { el, component } = orientedNotifications[i].vm;
        const pos = parseInt(el.style['top'], 10) - removedHeight - 16;
        component.props.offset = pos;
    }
};


// 关闭所有
const closeAll = (): void => {
    // 遍历所有方向，立即关闭它们。
    for (const key in instances) {
        instances.forEach(({ vm }) => {
            // same as the previous close method, we'd like to make sure lifecycle gets handle properly.
            (vm.component.proxy.data as ComponentPublicInstance<{ visible: boolean; }>).visible = false;
        });
    }
};

export default {
    info(options: options) {
        message('info', options);
    },
    success(options: options) {
        return message('success', options);
    },
    warning(options: options) {
        return message('warning', options);
    },
    error(options: options) {
        return message('error', options);
    },
    loading(options: options) {
        return message('loading', options);
    },
    // 全局配置
    config(options: options) {
        // 偏移位置
        if (options.offset) {
            offset = options.offset;
        }

        // 延迟时间
        if (options.duration && (options.duration > 0)) {
            defaultDuration = options.duration;
        }
    },
    close,
    closeAll
};
