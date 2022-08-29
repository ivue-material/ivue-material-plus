import { computed } from 'vue';
import { isNumeric } from '../../utils/validate';

export default (props, data) => {
      // 是否有箭头
      const hasArrows = computed((): boolean => {
            return props.showArrows && data.isOverflowing;
      });


      // 导航样式
      const containerStyles = computed(() => {
            const height = props.height;

            return {
                  height: isNumeric(height) ? `${parseInt(height, 10)}${props.unit}` : height,
                  transform: `translate3d(-${data.scrollOffset}${props.unit}, 0,0)`,
            };
      });

      // 激活的Index
      const activeIndex = computed(() => {
            return data.tabs.findIndex((tab, index) => {
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
