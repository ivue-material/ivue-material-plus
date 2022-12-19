
import {
  h,
  VNode
} from 'vue';

// 渲染点击按钮
export const genPickerButton = (emit, propsValue, value, updateName, content, readonly = false, staticClass = ''): VNode => {
  // 判读属性是否激活
  const active = propsValue === value;

  // 发送事件
  const click = (event: Event) => {
    event.stopPropagation();

    emit(`update:${updateName}`, value);
  };

  return h('div', {
    class: {
      [`ivue-picker-title-btn ${staticClass}`]: true,
      ['ivue-picker-readonly']: readonly
    },
    onClick: (active || readonly) ? undefined : click
  }, {
    default: () => Array.isArray(content) ? content : [content]
  });
};
