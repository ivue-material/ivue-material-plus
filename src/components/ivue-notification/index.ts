import { createVNode, VNode, render, h } from 'vue';

import IvueNotice from '../ivue-notice/notice.vue';

// 队列
const notifications = {
    'top-left': [],
    'top-right': [],
    'bottom-left': [],
    'bottom-right': [],
};

// 每个通知之间的间隙大小
const GAP_SIZE = 16;

// 创建新实例
IvueNotice.newInstance = (property) => {
    const _props = property || {};
    // 实例
    let vm: VNode = null;

    const container = document.createElement('div');

    vm = createVNode(IvueNotice, {
        ..._props
    });

    // instances will remove this item when close function gets called.
    //  So we do not need to worry about it.
    render(vm, container);

    document.body.appendChild(container.firstElementChild);

    // proxy
    const proxy: any = vm.component.proxy;


    return {
        // 添加
        notice(props) {
            // 偏移距离
            let verticalOffset = props.offset || 0;
            // 偏移方向
            const position = props.position || 'top-right';

            notifications[position].push({ vm });

            notifications[position]
                .forEach(({ vm }) => {
                    verticalOffset += (vm.el.offsetHeight || 0) + GAP_SIZE;
                });
            verticalOffset += GAP_SIZE;

            console.log(props);

            // proxy.add(props, verticalOffset);
        },
        // 删除
        remove(name) {
            proxy.close(name);
        },
        // 销毁
        destroy(element) {
            proxy.closeAll();

            setTimeout(() => {
                document.body.removeChild(document.getElementsByClassName(element)[0]);
            }, 500);
        },
        component: vm
    };
};



export default IvueNotice;
