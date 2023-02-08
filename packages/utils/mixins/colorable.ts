import { isCssColor } from '../helpers';

type Style = {
  style?: any;
  class?: any;
};

type Props = {
  textColor?: string;
};

export const colorable = (props?: Props) => {
  const textColor = props && props.textColor ? props.textColor : '#ffffff';

  // 设置背景颜色
  const setBackgroundColor = (
    color: string | string[],
    data: Style = {}
  ): Style => {
    // 是否是数组
    if (Array.isArray(color)) {
      data.style = {
        background: `linear-gradient(135deg,${color[0]} 0%, ${color[1]} 100%)`,
        color: textColor,
      };
    } else if (isCssColor(color)) {
      data.style = {
        ...data.style,
        'background-color': `${color}`,
        'border-color': `${color}`,
        color: textColor,
      };
    } else if (color) {
      data.class = {
        ...data.class,
        [color]: true,
      };
    }

    return data;
  };

  // 设置文字颜色
  const setTextColor = (color: string | string[], data: any = {}): Style => {
    // 是否是数组
    if (Array.isArray(color)) {
      data.style = {
        ...data.style,
        background: `linear-gradient(135deg,${color[0]} 0%, ${color[1]} 100%)`,
        color: `${color[0]}`,
      };
    } else if (isCssColor(color)) {
      data.style = {
        ...data.style,
        color: `${color}`,
      };
    } else if (color) {
      const [colorName] = color.toString().trim().split(' ', 2);

      data.class = {
        ...data.class,
        [colorName + '--text']: true,
      };
    }

    return data;
  };

  return {
    setBackgroundColor,
    setTextColor,
  };
};
