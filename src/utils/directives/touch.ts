interface Target extends Element {
    _touchHandlers?: any;
}

type Handlers = {
    left: () => void;
    right: () => void;
    up: () => void;
    down: () => void;
    start: () => void;
    move: () => void;
    end: () => void;
}

// 处理手势
function handleGesture(wrapper) {
    const { touchstartX, touchendX, touchstartY, touchendY } = wrapper;

    // 用于判断方向边界
    const dirRatio = 0.5;
    // 用于判断滑动距离是否满足滑动
    const minDistance = 16;

    // 手指滑动距离
    wrapper.offsetX = touchendX - touchstartX;
    wrapper.offsetY = touchendY - touchstartY;

    // 判断左右滑动
    if (Math.abs(wrapper.offsetY) < dirRatio * Math.abs(wrapper.offsetX)) {
        wrapper.left && (touchendX < touchstartX - minDistance) && wrapper.left(wrapper);
        wrapper.right && (touchendX > touchstartX + minDistance) && wrapper.right(wrapper);
    }

    // 判断上下滑动
    if (Math.abs(wrapper.offsetX) < dirRatio * Math.abs(wrapper.offsetY)) {
        wrapper.up && (touchendY < touchstartY - minDistance) && wrapper.up(wrapper);
        wrapper.down && (touchendY > touchstartY + minDistance) && wrapper.down(wrapper);
    }

}

// 开始
function touchstart(event: TouchEvent, wrapper) {
    const touch = event.changedTouches[0];
    wrapper.touchstartX = touch.clientX;
    wrapper.touchstartY = touch.clientY;

    wrapper.start && wrapper.start(Object.assign(event, wrapper));
}

// 结束
function touchend(event: TouchEvent, wrapper) {
    const touch = event.changedTouches[0];
    wrapper.touchendX = touch.clientX;
    wrapper.touchendY = touch.clientY;

    wrapper.end && wrapper.end(Object.assign(event, wrapper));

    // 处理手势
    handleGesture(wrapper);
}

// 移动
function touchmove(event: TouchEvent, wrapper) {
    const touch = event.changedTouches[0];
    wrapper.touchmoveX = touch.clientX;
    wrapper.touchmoveY = touch.clientY;

    wrapper.move && wrapper.move(Object.assign(event, wrapper));
}

// 创建事件
function createHandlers(value: Handlers) {
    const wrapper = {
        touchstartX: 0,
        touchstartY: 0,
        touchendX: 0,
        touchendY: 0,
        touchmoveX: 0,
        touchmoveY: 0,
        offsetX: 0,
        offsetY: 0,
        left: value.left,
        right: value.right,
        up: value.up,
        down: value.down,
        start: value.start,
        move: value.move,
        end: value.end
    };

    return {
        touchstart: (e: TouchEvent) => touchstart(e, wrapper),
        touchend: (e: TouchEvent) => touchend(e, wrapper),
        touchmove: (e: TouchEvent) => touchmove(e, wrapper)
    };
}

// 指令定义
function inserted(el: Element, binding: Record<string, any>) {
    const value = binding.value;

    const target: Target = value.parent ? el.parentElement : el;
    const options = value.options || { passive: true };

    if (!target) {
        return;
    }

    const handlers = createHandlers(value);
    target._touchHandlers = Object(target._touchHandlers);
    target._touchHandlers[binding.instance.$.uid] = handlers;

    // 添加事件
    Object.keys(handlers).forEach((eventName) => {
        target.addEventListener(eventName, handlers[eventName], options);
    });
}


// 指令与元素解绑时调用
function unbind(el: Element, binding: Record<string, any>) {
    const target: Target = binding.value.parent ? el.parentElement : el;

    if (!target || !target._touchHandlers) {
        return;
    }

    const handlers = target._touchHandlers[binding.instance.$.uid];
    Object.keys(handlers).forEach((eventName) => {
        target.removeEventListener(eventName, handlers[eventName]);
    });

    delete target._touchHandlers[binding.instance.$.uid];
}

export default {
    beforeMount: inserted,
    unmounted: unbind
};
