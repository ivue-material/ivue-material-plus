import { App } from 'vue';

import IvueSpin from './spin';

let spinInstance;

// 获取组件实例
function getSpinInstance(render = undefined) {
    spinInstance = spinInstance || IvueSpin.newInstance({
        render: render
    });

    return spinInstance;
}

// loading 加载中
function loading(options) {
    const render = ('render' in options) ? options.render : undefined;
    const instance = getSpinInstance(render);

    instance.show(options);
}

// 显示
IvueSpin.show = function (props = {}) {
    return loading(props);
};

// 隐藏
IvueSpin.hide = function () {
    // 没有实例
    if (!spinInstance) {
        return false;
    }

    const instance = getSpinInstance();

    // 删除实例
    instance.remove(() => {
        spinInstance = null;
    });
};

export default (app: App): void => {
    app.config.globalProperties.$IvueSpin = IvueSpin;

    app.component(IvueSpin.name, IvueSpin);
};

export { IvueSpin };
