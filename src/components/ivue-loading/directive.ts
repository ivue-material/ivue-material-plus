import Loading from './loading';

const vLoading = {
    mounted(el, binding) {
        const textExr = el.getAttribute('ivue-loading-text');
        const iconClassExr = el.getAttribute('ivue-loading-iconclass');
        const iconTextExr = el.getAttribute('ivue-loading-icontext');
        const backgroundExr = el.getAttribute('ivue-loading-background');
        const customClassExr = el.getAttribute('ivue-loading-custom-class');

        // 当前实例
        const vm = binding.instance;

        // 设置参数
        const instance = Loading({
            // 显示在加载图标下方的加载文案
            text: vm && vm[textExr] || textExr,
            // 自定义加载图标类名
            iconClass: vm && vm[iconClassExr] || iconClassExr,
            // 图标 slot
            iconText: vm && vm[iconTextExr] || iconTextExr,
            // 遮罩背景色
            background: vm && vm[backgroundExr] || backgroundExr,
            // Loading 的自定义类名
            customClass: vm && vm[customClassExr] || customClassExr,
            // 开启全屏
            fullscreen: !!binding.modifiers.fullscreen,
            // 需要覆盖的 DOM 节点
            target: binding.modifiers.fullscreen ? null : el,
            // 使遮罩插入至 DOM 中的 body 上
            body: !!binding.modifiers.body,
            // 隐藏
            visible: !!binding.value,
            // 锁定屏幕的滚动
            lock: !!binding.modifiers.lock,
        });

        // 重置实例
        el.instance = instance;
    },
    updated(el, binding) {
        const instance = el.instance;

        if (!instance) {
            return;
        }

        instance.setText(el.getAttribute('ivue-loading-text'));

        // 当前值是否有更新
        if (binding.oldValue !== binding.value) {
            // 当前值是否相等
            if (binding.value && !instance.visible.value) {
                instance.visible.value = true;
            } else {
                instance.visible.value = false;
            }
        }
    },
    // 销毁
    unmounted(el) {
    // 关闭实例
    el?.instance?.close();
    },
};

export default vLoading;
