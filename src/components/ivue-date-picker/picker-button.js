
import {
  h,
} from 'vue';

// 渲染点击按钮
export const genPickerButton = (emit, propsValue, value, updateName, content, readonly = false, staticClass = '') => {
  // 判读属性是否激活
  const active = propsValue === value;

  // 发送事件
  const click = (event) => {
    event.stopPropagation();

    emit(`update:${updateName}`, value);
  };

  return h('div', {
    class: {
      [`ivue-picker-title-btn ${staticClass}`]: true
    },
    onClick: (active || readonly) ? undefined : click
  }, {
    default: () => Array.isArray(content) ? content : [content]
  });
};
