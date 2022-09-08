import { computed } from 'vue';

export default (props, data) => {
      // 是否有箭头
      const hasArrows = computed((): boolean => {
            return props.showArrows && data.isOverflowing;
      });


      // 导航样式
      const containerStyles = computed(() => {
            const height = props.height;

            const regexp = new RegExp(/[a-zA-Z]/g);

            // 是否有单位
            const isUnit = regexp.test(height);

            return {
                  height: !isUnit ? `${height}px` : height,
                  transform: `translate3d(-${data.scrollOffset}${props.unit}, 0,0)`,
            };
      });

      // 激活的Index
      const activeIndex = computed(() => {
            return data.tabs.findIndex((tab, index: number) => {
                  if (!props.modelValue) {
                        return index === 0;
                  }

                  return tab.name === props.modelValue || index === props.modelValue;
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
