// @ts-nocheck
import { computed } from 'vue';
import { isClient } from '../helpers';

export const mixinsLink = (proxy, { to, replace, target }) => {
  // computed

  // 链接
  const linkUrl = computed(() => {
    // 跳转的链接，支持 vue-router 对象
    const type = typeof to;

    // 判断是否字符串
    if (type !== 'string') {
      return null;
    }

    // absolute url 不需要路由
    if (to.includes('//')) {
      return to;
    }

    // router
    const router = proxy.$router;

    // 是否有路由
    if (router) {
      // 当前路由
      const current = proxy.$route;

      // 路由对象
      const route = router.resolve(to, current);

      return route ? route.href : to;
    }

    return to;
  });

  // methods

  // 打开新窗口
  const handleOpenTo = () => {
    if (!isClient) {
      return;
    }

    const router = proxy.$router;
    let _to = to;

    // 路由对象
    if (router) {
      // 当前路由
      const current = proxy.$route;

      // 路由对象
      const route = router.resolve(to, current);

      _to = route ? route.href : to;
    }

    // 判断是否字符串
    if (typeof to === 'string') {
      return;
    }

    window.open(_to);
  };

  // 跳转新链接
  const handleLink = (newWindow = false) => {
    if (!isClient) {
      return;
    }

    // 打开新窗口
    if (newWindow) {
      handleOpenTo();
    }
    // 没有打开新窗口
    else {
      const router = proxy.$router;

      // 路由对象
      if (router) {
        // href
        if (typeof to === 'string' && to.includes('//')) {
          window.location.href = to;
        }
        // replace
        else {
          replace
            ? proxy.$router.replace(to, () => {})
            : proxy.$router.push(to, () => {});
        }
      }
      // 普通链接
      else {
        window.location.href = to;
      }
    }
  };

  // 检查点击事件
  const handleCheckClick = (event: Event, newWindow = false) => {
    // 跳转的链接
    if (to) {
      // 相当于 a 链接的 target 属性
      if (target === '_blank') {
        handleOpenTo();

        return false;
      }
      // 没有打开新窗口
      else {
        event.preventDefault();

        handleLink(newWindow);
      }
    }
  };

  return {
    // computed
    linkUrl,

    // methods
    handleOpenTo,
    handleLink,
    handleCheckClick,
  };
};
