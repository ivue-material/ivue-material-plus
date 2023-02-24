// type
import type { InjectionKey, Ref } from 'vue';
import type {
  TabsProps,
  TabInstance,
  ItemInstance,
} from '@ivue-material-plus/components/ivue-tabs';

export type TabsContext = {
  props: TabsProps;

  // tab导航数组
  tabs: Ref<TabInstance[]>;
  // tab内容数组
  tabsItem: Ref<ItemInstance[]>;

  // 导航点击
  tabNavClick: (tab: TabInstance) => void;

  // 清除tab导航
  unregister: (tabName: string | number) => void;
  // 清除 tab item
  unregisterItems: (uid: number) => void;
};

export const TabsContextKey: InjectionKey<TabsContext> = Symbol('ivue-tabs');
