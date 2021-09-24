
export default (data: any, container: HTMLElement, wrapper: HTMLElement) => {
      // 手势开始
      const onTouchStart = (e) => {
            data.startX = data.scrollOffset + e.touchstartX;

            container.style.transition = 'none';
            container.style.willChange = 'transform';
      }

      // 手势移动
      const onTouchMove = (e: any) => {
            data.scrollOffset = data.startX - e.touchmoveX;
      }

      // 手势结束
      const onTouchEnd = () => {
            const maxScrollOffset = container.clientWidth - wrapper.clientWidth;

            container.style.transition = '';
            container.style.willChange = '';

            if (data.scrollOffset < 0 || !data.isOverflowing) {
                  data.scrollOffset = 0;
            }
            else if (data.scrollOffset >= maxScrollOffset) {
                  data.scrollOffset = maxScrollOffset;
            }
      }

      return {
            onTouchStart,
            onTouchMove,
            onTouchEnd
      }
}
