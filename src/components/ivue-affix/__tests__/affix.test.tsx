import { nextTick } from 'vue';
import { describe, test, expect, vi, afterAll, beforeAll } from 'vitest';

import { mount } from '@vue/test-utils';
import type { VNode } from 'vue';

// 模拟滚动
import makeScroll from '../../../test-utils/make-scroll';

import defineGetter from '../../../test-utils/define-getter';

import Affix from '../src/affix.vue';

// 安装组件
const _mount = (render: () => VNode) => {
  return mount(render, {
    // 指定要安装组件的节点
    attachTo: document.body,
  });
};

const CONTENT = 'affix test';

let clientHeightRestore: () => void;

// 在开始在当前上下文中运行所有测试之前，注册一个要调用一次的回调
// 测试运行之前设置模拟数据
beforeAll(() => {
  clientHeightRestore = defineGetter(
    window.HTMLElement.prototype,
    'clientHeight',
    1000,
    0
  );
});

// 注册一个回调，在所有测试都在当前上下文中运行后调用一次
afterAll(() => {
  clientHeightRestore();
});

describe('Affix.vue', () => {
  test('render test', async () => {
    const wrapper = _mount(() => <Affix>{CONTENT}</Affix>);
    await nextTick();

    // text = CONTENT
    expect(wrapper.text()).toEqual(CONTENT);

    const mockAffixRect = vi
      // 在对象的方法或 getter/setter 上创建一个 spy。
      .spyOn(wrapper.find('.ivue-affix').element, 'getBoundingClientRect')
      // 接受将在调用模拟函数时返回的值
      .mockReturnValue({
        height: 40,
        width: 1000,
        top: -100,
        bottom: -80,
      } as DOMRect);

    const mockDocumentRect = vi
      // 在对象的方法或 getter/setter 上创建一个 spy。
      .spyOn(document.documentElement, 'getBoundingClientRect')
      // 接受将在调用模拟函数时返回的值
      .mockReturnValue({
        height: 200,
        width: 1000,
        top: 0,
        bottom: 200,
      } as DOMRect);

    // 是否存在 fixed
    expect(wrapper.find('.ivue-affix-fixed').exists()).toBe(false);
    await makeScroll(document.documentElement, 'scrollTop', 300);
    expect(wrapper.find('.ivue-affix-fixed').exists()).toBe(true);

    // 将内部实现恢复到原始功能
    mockAffixRect.mockRestore();
    mockDocumentRect.mockRestore();
  });
});
