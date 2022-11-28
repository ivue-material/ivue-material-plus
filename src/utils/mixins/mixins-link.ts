import { oneOf } from '../assist';
import { isClient } from '../helpers';

export default {
  props: {
    /**
     * 跳转的链接，支持 vue-router 对象
     *
     * @type {Object | String}
     */
    to: {
      type: [Object, String]
    },
    /**
     * 相当于 a 链接的 target 属性
     *
     * @type {String}
     */
    target: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['_blank', '_self', '_parent', '_top']);
      },
      default: '_self'
    },
  },
  computed: {
    // 链接
    linkUrl() {
      // 跳转的链接，支持 vue-router 对象
      const type = typeof this.to;

      // 判断是否字符串
      if (type !== 'string') {
        return null;
      }

      /* absolute url 不需要路由 */
      if (this.to.includes('//')) {
        return this.to;
      }

      // router
      const router = this.$router;

      // 是否有路由
      if (router) {
        // 当前路由
        const current = this.$route;

        // 路由对象
        const route = router.resolve(this.to, current);

        return route ? route.href : this.to;
      }

      return this.to;
    }
  },
  methods: {
    // 打开新窗口
    handleOpenTo() {
      if (!isClient) {
        return;
      }

      const router = this.$router;
      let to = this.to;

      // 路由对象
      if (router) {
        // 当前路由
        const current = this.$route;

        // 路由对象
        const route = router.resolve(this.to, current);

        to = route ? route.href : this.to;
      }

      // 判断是否字符串
      if (typeof this.to === 'string') {
        return;
      }

      window.open(to);
    },
    // 跳转新链接
    handleLink(newWindow = false) {

      if (!isClient) {
        return;
      }

      // 打开新窗口
      if (newWindow) {
        this.handleOpenTo();
      }
      // 没有打开新窗口
      else {
        const router = this.$router;

        // 路由对象
        if (router) {
          // href
          if ((typeof this.to === 'string') && this.to.includes('//')) {
            window.location.href = this.to;
          }
          // replace
          else {
            this.replace ?
              this.$router.replace(this.to, () => {}) :
              this.$router.push(this.to, () => {});
          }
        }
        // 普通链接
        else {
          window.location.href = this.to;
        }
      }
    },
    // 检查点击事件
    handleCheckClick(event: Event, newWindow = false as boolean) {
      // 跳转的链接
      if (this.to) {
        // 相当于 a 链接的 target 属性
        if (this.target === '_blank') {
          this.handleOpenTo();

          return false;
        }
        // 没有打开新窗口
        else {
          event.preventDefault();

          this.handleLink(newWindow);
        }
      }
    }
  },
};
