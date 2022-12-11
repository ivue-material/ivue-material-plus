import { computed } from 'vue';

// type
import { Props, Data } from './types/tabs';

export default (props: Props, data: Data) => {
      // 是否有箭头
      const hasArrows = computed((): boolean => {
            return props.showArrows && data.isOverflowing;
      });


      // 导航样式
      const containerStyles = computed(() => {
            const height = props.height;

            const regexp = new RegExp(/[a-zA-Z]/g);

            // 是否有单位
            const isUnit = regexp.test(`${height}`);

            return {
                  height: !isUnit ? `${height}px` : height,
                  transform: `translate3d(-${data.scrollOffset}px, 0,0)`,
            };
      });

      // 没有找到可以激活的tab
      const noFindActiveTab = computed(() => {
            return data.tabs.findIndex((tab, index: number) => {
                  return tab.tabName === props.modelValue || index === props.modelValue;
            });
      });

      // 激活的Index
      const activeIndex = computed(() => {

            return data.tabs.findIndex((tab, index: number) => {
                  if (!props.modelValue) {
                        return index === 0;
                  }

                  // 没有找到可以激活的tab 默认激活第一项
                  if (noFindActiveTab.value === -1) {
                        return index === 0;
                  }

                  return tab.tabName === props.modelValue || index === props.modelValue;
            });
      });


      // 激活的tab
      const activeTab = computed(() => {
            if (!data.tabs.length) {
                  return undefined;
            }

            return data.tabs[activeIndex.value];
      });

      return {
            hasArrows,
            activeTab,
            activeIndex,
            containerStyles,
      };
};
