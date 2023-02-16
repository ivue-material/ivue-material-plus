import { ref, getCurrentInstance, unref, computed, onMounted } from 'vue';
import { isClient } from '@ivue-material-plus/utils/helpers';

// type
import type { CardProps } from './card';
import type { ComponentInternalInstance } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export const useCard = (
  props: CardProps,
  slots: ComponentInternalInstance['slots']
) => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;

  // 是否显示标题
  const showTitle = ref<boolean>(false);

  // 额外显示的内容，默认位置在右上角
  const showExtra = ref<boolean>(false);

  // computed

  // 是否是 a 标签
  const isHrefPattern = computed(() => {
    return !!props.to;
  });

  // 标签名称
  const tagName = computed(() => {
    // 是否是跳转链接
    return unref(isHrefPattern) ? 'a' : 'div';
  });

  // 跳转的链接
  const linkUrl = computed(() => {
    // 跳转的链接，支持 vue-router 对象
    const type = typeof props.to;

    // 判断是否字符串
    if (type !== 'string') {
      return null;
    }

    // absolute url 不需要路由
    if (`${props.to}`.includes('//')) {
      return props.to;
    }

    // router
    const router = proxy?.$router;

    // 是否有路由
    if (router) {
      // 当前路由
      const current = proxy?.$route;

      // 路由对象
      const route = router.resolve(props.to as RouteLocationRaw, current);

      return route ? route.href : props.to;
    }

    return props.to;
  });

  // 标签属性
  const tagProps = computed(() => {
    // 链接
    if (unref(isHrefPattern)) {
      return {
        href: unref(linkUrl),
        target: props.target,
      };
    } else {
      return {};
    }
  });

  // methods

  // 跳转链接
  const handleLink = (event: KeyboardEvent) => {
    if (!isClient) {
      return;
    }

    // 是否是 a 标签
    if (!unref(isHrefPattern)) {
      return;
    }

    const openInNewWindow = event.ctrlKey || event.metaKey;

    // 跳转的链接
    if (props.to) {
      // blank
      if (props.target === '_blank') {
        handleLinkBlank();
      } else {
        // preventDefault
        event.preventDefault();

        const router = proxy?.$router;

        // 打开新窗口
        if (openInNewWindow) {
          handleLinkBlank();
        }
        // 不是打开新窗口
        else {
          // 有路由
          if (router) {
            // url跳转
            if (typeof props.to === 'string' && props.to.includes('//')) {
              window.location.href = props.to;
            }
            // 路由跳转
            else {
              props.replace ? router.replace(props.to) : router.push(props.to);
            }
          }
          // 跳转链接
          else {
            window.location.href = `${props.to}`;
          }
        }
      }
    }
  };

  // 打开链接 blank
  const handleLinkBlank = () => {
    const router = proxy?.$router;

    // 跳转的链接
    let to = props.to;

    if (router) {
      const current = proxy?.$route;

      // 跳转路由
      const route = router.resolve(props.to as RouteLocationRaw, current);

      // 获取跳转链接
      to = route ? route.href : props.to;
    }

    if (typeof props.to === 'string') {
      return;
    }

    window.open(`${to}`);
  };

  // onMounted
  onMounted(() => {
    // 是否显示头部
    showTitle.value = !!props.title || slots.title !== undefined;

    // 额外显示的内容，默认位置在右上角
    showExtra.value = slots.extra !== undefined;
  });

  return {
    // data
    showTitle,
    showExtra,

    // computed
    tagName,
    tagProps,

    // methods
    handleLink,
  };
};
