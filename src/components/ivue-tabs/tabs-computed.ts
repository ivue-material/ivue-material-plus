import { computed } from 'vue'
import { isNumeric } from '../../utils/validate';

export default (props, data) => {
      // 是否有箭头
      const hasArrows = computed((): boolean => {
            return props.showArrows && data.isOverflowing;
      });


      // 导航样式
      const containerStyles = computed(() => {
            const height = props.height

            return height ? {
                  height: isNumeric(height) ? `${parseInt(height, 10)}px` : height
            } : null
      })

      return {
            hasArrows,
            containerStyles
      }
}
