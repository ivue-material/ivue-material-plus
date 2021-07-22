import { createVNode, VNode, render, h } from 'vue';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

import Notice from './index.vue';

type options = {
    title?: string,
    desc?: string,
    name?: string,
    onClose?: () => any,
    render?: () => any,
    duration?: number,
    top?: number,
    position?: number,
    offset?: number,
    id?: string,
    zIndex?: number
}


const prefixKey = 'ivue_notice_key_';
// 顶部距离
const top = 24;
// 默认延迟关闭时间
const defaultDuration = 4.5;
let name = 1;

// 图标类型
const iconTypes = {
    'success': 'check_circle',
    'info': 'info',
    'warning': 'warning',
    'error': 'error'
};

// 队列
const notifications = {
    'top-left': [],
    'top-right': [],
    'bottom-left': [],
    'bottom-right': [],
};


function notice(type, options: options = {}) {
    // 标题
    options.title = options.title || '';
    // // 描述
    options.desc = options.desc || '';

    // onclose
    options.onClose = options.onClose || function () { };

    // duration
    options.duration = options.duration || defaultDuration;

    name++;

    // 偏移距离
    const verticalOffset = options.offset || 0;
    // 偏移方向
    const position = options.position || 'top-right';

    // key
    const id = `${prefixKey}${name}`;

    // 获取Index
    const handleGetIndex = () => {
        transferIncrease();
        return transferIndex;
    };

    // 当前index
    const tIndex = handleGetIndex();



    options = {
        // default options end
        ...options,
        onClose: options.onClose || function () { },
        offset: verticalOffset,
        id: id,
        zIndex: 1010 + tIndex,
    };



    const vm: VNode = createVNode(Notice, options);
    const container = document.createElement('div');

    notifications[position].push({ vm });

    // instances will remove this item when close function gets called.
    //  So we do not need to worry about it.
    render(vm, container);

    document.body.appendChild(container.firstElementChild);

    console.log(vm);
    console.log(options);

    // const instance = getNoticeInstance();

    // let content;

    // let haveIcon;

    // 描述
    // const haveDesc = (options.render && !title) ? '' :
    //     (desc || options.render) ?
    //         `${prefixCls}-have-desc` : '';


    // if (type === 'normal') {
    //     haveIcon = false;
    //     content = `
    //           <div class="${prefixCls}-content ${haveDesc}">
    //                 <div class="${prefixCls}-title">${title}</div>
    //                 <div class="${prefixCls}-desc">${desc}</div>
    //           </div>
    //     `;
    // }
    // else {
    //     const iconType = iconTypes[type];

    //     haveIcon = true;

    //     content = `
    //           <div class="${prefixCls}-content ${prefixCls}-have-icon ${prefixCls}-have-${type} ${haveDesc}">
    //                 <i class="ivue-icon ${prefixCls}-icon ${prefixCls}-icon-${type}">${iconType}</i>
    //                 <div class="${prefixCls}-title">${title}</div>
    //                 <div class="${prefixCls}-desc">${desc}</div>
    //           </div>
    //     `;
    // }


    // instance.notice({
    //     prefixCls: prefixCls,
    //     name: key.toString(),
    //     duration: duration,
    //     styles: {},
    //     transitionName: 'move-notice',
    //     content: content,
    //     render: render,
    //     onClose: onClose,
    //     closable: true,
    //     type: 'notice',
    //     haveIcon: haveIcon
    // });
}

const notification = {
    open(options: options) {
        return notice('normal', options);
    },
    // info(options: options) {
    //     return notice('info', options);
    // },
    // warning(options: options) {
    //     return notice('warning', options);
    // },
    // success(options: options) {
    //     return notice('success', options);
    // },
    // error(options: options) {
    //     return notice('error', options);
    // },
    // // 全局配置
    // config(options: options) {
    //     // 顶部距离
    //     if (options.top) {
    //         top = options.top;
    //     }

    //     // 延迟关闭时间
    //     if (options.duration || options.duration === 0) {
    //         defaultDuration = options.duration;
    //     }
    // },
    // // 关闭某个通知
    // close(name) {
    //     if (name) {
    //         name = name.toString();

    //         if (noticeInstance) {
    //             noticeInstance.remove(name);
    //         }
    //     }
    //     else {
    //         return false;
    //     }
    // },
    // // 销毁所有组件
    // destroy() {
    //     const instance = getNoticeInstance();
    //     noticeInstance = null;

    //     // 销毁
    //     instance.destroy('ivue-notice');
    // }
};
export default notification;
