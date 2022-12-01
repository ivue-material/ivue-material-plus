import type { ComponentInternalInstance } from 'vue';
import type { Options, TmpItem, MenuItemInstance, Result } from './cascader';

export interface Props {
  options: Options[];
  disabled: boolean;
  changeOnSelect: boolean;
  trigger?: string
}

export interface Data {
  tmpItem: TmpItem;
  sublist: MenuItemInstance[];
  result: Result[];
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  ctx: any
}
