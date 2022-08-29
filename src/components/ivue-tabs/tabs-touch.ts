import { getCurrentInstance } from 'vue';

export default (data: any, container: any, wrapper: any, activeIndex) => {
      const { proxy }: any = getCurrentInstance();

      // 手势开始
      const onTouchStart = (e) => {
            data.startX = data.scrollOffset + e.touchstartX;

            container.value.style.transition = 'none';
            container.value.style.willChange = 'transform';
      };

      // 手势移动
      const onTouchMove = (e: any) => {
            data.scrollOffset = data.startX - e.touchmoveX;
      };

      // 手势结束
      const onTouchEnd = () => {
            const maxScrollOffset = container.value.clientWidth - wrapper.value.clientWidth;

            container.value.style.transition = '';
            container.value.style.willChange = '';

            if (data.scrollOffset < 0 || !data.isOverflowing) {
                  data.scrollOffset = 0;
            }
            else if (data.scrollOffset >= maxScrollOffset) {
                  data.scrollOffset = maxScrollOffset;
            }
      };

      // 偏移位置
      const newOffset = (direction: string) => {
            const clientWidth = wrapper.value.clientWidth;

            if (direction === 'prev') {
                  return Math.max(data.scrollOffset - clientWidth, 0);
            }
            else {
                  return Math.min(data.scrollOffset + clientWidth, container.value.clientWidth - clientWidth);
            }
      };

      // 内容滑动切换.
      const handleSwipeItem = (direction) => {
            // 左
            if (direction === 'next') {
                  const index = activeIndex.value + 1;

                  const tab = data.tabs[index];

                  if (tab) {
                        proxy.tabNavClick(tab);
                  }
            }

            // 右
            if (direction === 'prev') {
                  const index = activeIndex.value - 1;

                  const tab = data.tabs[index];

                  if (tab) {
                        proxy.tabNavClick(tab);
                  }
            }

      };

      return {
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            newOffset,
            handleSwipeItem
      };
};
