const CLICK = 'click';
// 捕获实例
const captureInstances = Object.create(null);
// 不捕获实例
const nonCaptureInstances = Object.create(null);
// 实例列表
const instancesList = [captureInstances, nonCaptureInstances];

/**
 * The common event handler for bot capture and non-capture events.
 *
 * @param {!Object} context - The event context.
 * @param {!Object} instances - The capture or non-capture registered instances.
 * @param {Event} event - The event object.
 * @returns {undefined} Default.
 */

const commonHandler = function _onCommonHandler(context, instances, event) {
    const {
        target
    } = event;

    const item = function _item(item) {
        const {
            el
        } = item;

        if (el !== target && !el.contains(target)) {
            const {
                binding
            } = item;

            if (binding.modifiers.stop) {
                event.stopPropagation();
            }

            if (binding.modifiers.prevent) {
                event.preventDefault();
            }

            binding.value.call(context, event);
        }

    };

    const key = function _key(eventName) {
        return instances[eventName].forEach(item);
    };

    Object.keys(instances).forEach(key);
};

// 捕获事件处理程序
const captureEventHandler = function onCaptureEvent(event) {
    commonHandler(this, captureInstances, event);
};

// 非捕获事件处理程序
const nonCaptureEventHandler = function onNonCaptureEvent(event) {
    commonHandler(this, nonCaptureInstances, event);
};

// 获取事件处理程序
const getEventHandler = function _getEventHandler(useCapture) {
    return useCapture ? captureEventHandler : nonCaptureEventHandler;
};

// 指令定义
function inserted(el: Element, binding: Record<string, any>): void {
    // 判断参数
    if (typeof binding.value !== 'function') {
        throw new TypeError('Binding value must be a function');
    }

    // 传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。

    const arg = binding.arg || CLICK;

    // 归并事件绑定
    const normalisedBinding = {
        ...binding,
        ...{
            arg,
            // 一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }
            modifiers: {
                ...{
                    // 添加事件侦听器时使用 capture 模式
                    capture: false,
                    // 阻止默认行为
                    prevent: false,
                    //  调用 event.stopPropagation() 停止冒泡
                    stop: false
                },
                ...binding.modifiers
            }
        }
    };

    const useCapture = normalisedBinding.modifiers.capture;
    // 实例化事件
    const instances = useCapture ? captureInstances : nonCaptureInstances;

    // 判断事件中是否有对应的指令参数 初始化指令
    if (!Array.isArray(instances[arg])) {
        instances[arg] = [];
    }

    if (instances[arg].push({
        el,
        binding: normalisedBinding
    }) === 1) {
        if (typeof document === 'object' && document) {
            document.addEventListener(arg, getEventHandler(useCapture), useCapture);
        }
    }
}

// 指令与元素解绑时调用
function unbind(el: Element): void {
    // 比较元素
    const compareElements = function _compareElements(item) {
        return item.el !== el;
    };

    const instances = function _instances(instances) {
        // 实例key
        const instancesKeys = Object.keys(instances);

        // 判断是否有实例
        if (instancesKeys.length) {
            // 判断是否使用事件捕获
            const useCapture = instances === captureInstances;


            const keys = function _keys(eventName) {
                // 查找元素实例
                const newInstance = instances[eventName].filter(compareElements);

                if (newInstance.length) {
                    instances[eventName] = newInstance;
                } else {
                    if (typeof document === 'object' && document) {
                        // 移除事件
                        document.removeEventListener(eventName, getEventHandler(useCapture), useCapture);
                    }

                    delete instances[eventName];
                }
            };


            instancesKeys.forEach(keys);
        }
    };


    instancesList.forEach(instances);
}

export default {
    beforeMount: inserted,
    unmounted: unbind
};
