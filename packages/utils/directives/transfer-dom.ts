// Thanks to: https://github.com/airyland/vux/blob/v2/src/directives/transfer-dom/index.js
// Thanks to: https://github.com/calebroseland/vue-dom-portal

/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
function getTarget(node) {
  if (node === void 0) {
    node = document.body;
  }
  if (node === true) {
    return document.body;
  }
  return node instanceof window.Node ? node : document.querySelector(node);
}

// 指令定义
function beforeMount(el: any, { value }) {
  if (el.dataset && el.dataset.transfer !== 'true') {
    return false;
  }

  el.className = el.className
    ? el.className + ' v-transfer-dom'
    : 'v-transfer-dom';
  const parentNode = el.parentNode;

  // 没有父节点
  if (!parentNode) {
    return;
  }

  const home = document.createComment('');
  let hasMovedOut = false;

  if (value !== false) {
    // moving out, el is no longer in the document
    parentNode.replaceChild(home, el);
    // 移动到新的地方
    getTarget(value).appendChild(el);

    hasMovedOut = true;
  }

  if (!el.__transferDomData) {
    el.__transferDomData = {
      parentNode: parentNode,
      home: home,
      target: getTarget(value),
      hasMovedOut: hasMovedOut,
    };
  }
}

/**
 * 所在组件的 VNode 更新时调用
 *
 * el: HTMLElement, binding: VNodeDirective
 */
function updated(el: Record<string, any>, { value }) {
  if (el.dataset && el.dataset.transfer !== 'true') {
    return false;
  }

  // need to make sure children are done updating (vs. `update`)
  // 需要确保孩子完成更新（相对于 `update`）
  const ref$1 = el.__transferDomData;

  // 没有创建节点初始化创建
  if (!ref$1) {
    beforeMount(el, { value });
    return;
  }

  // homes.get(el)
  const parentNode = ref$1.parentNode;
  const home = ref$1.home;

  // recall where home is
  const hasMovedOut = ref$1.hasMovedOut;

  if (!hasMovedOut && value) {
    // remove from document and leave placeholder
    parentNode.replaceChild(home, el);
    // append to target
    getTarget(value).appendChild(el);

    // 从文档中删除并留下占位符
    el.__transferDomData = Object.assign({}, el.__transferDomData, {
      hasMovedOut: true,
      target: getTarget(value),
    });
  } else if (hasMovedOut && value === false) {
    // previously moved, coming back home
    parentNode.replaceChild(el, home);

    el.__transferDomData = Object.assign({}, el.__transferDomData, {
      hasMovedOut: false,
      target: getTarget(value),
    });
  } else if (value) {
    // already moved, going somewhere else
    getTarget(value).appendChild(el);
  }
}

// 指令与元素解绑时调用
function unmounted(el) {
  if (el.dataset && el.dataset.transfer !== 'true') {
    return false;
  }

  el.className = el.className.replace('v-transfer-dom', '');

  const ref$1 = el.__transferDomData;
  if (!ref$1) {
    return;
  }

  // 移除节点
  if (el.__transferDomData.hasMovedOut === true) {
    el.__transferDomData.parentNode &&
      el.__transferDomData.parentNode.appendChild(el);
  }

  el.__transferDomData = null;
}

export default {
  beforeMount,
  unmounted,
  updated,
};
