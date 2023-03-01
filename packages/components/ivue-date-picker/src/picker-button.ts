import { h, VNode } from 'vue';

// type
import type { SetupContext } from 'vue';

// 更新事件名称
type UpdateName = 'selectingYear';

// 渲染点击按钮
export const genPickerButton = (
  emit: SetupContext<['update:selectingYear']>['emit'],
  propsValue: boolean,
  value: boolean,
  updateName: UpdateName,
  // 节点类型
  content: (VNode | string | null | number)[] | VNode,
  // 是否只读
  readonly = false,
  // 自定义样式
  staticClass = ''
): VNode => {
  // 判读属性是否激活
  const active = propsValue === value;

  // 发送事件
  const click = (event: Event) => {
    event.stopPropagation();

    emit(`update:${updateName}`, value);
  };

  return h(
    'div',
    {
      class: {
        [`ivue-picker-title-btn ${staticClass}`]: true,
        ['ivue-picker-readonly']: readonly,
      },
      onClick: active || readonly ? undefined : click,
    },
    {
      default: () => (Array.isArray(content) ? content : [content]),
    }
  );
};
