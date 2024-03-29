<template>
  <ul :class="wrapperClasses" :style="wrapperStyles">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { computed, onMounted, reactive, provide, watch, nextTick } from 'vue';
import { oneOf } from '../../utils/assist';
import { findComponentsUpward } from '../../utils/helpers';

// ts
import { MenuContextKey, Props, Data } from './types/menu';

const prefixCls = 'ivue-menu';

export default {
  name: prefixCls,
  emits: ['on-select', 'on-open-change'],
  props: {
    /**
     * 主题，可选值为 light、dark、primary，其中 primary 只适用于 mode="horizontal"
     *
     * @type {String}
     */
    theme: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['light', 'dark', 'primary']);
      },
      default: 'light',
    },
    /**
     * 菜单类型，可选值为 horizontal（水平） 和 vertical（垂直）
     *
     * @type {String}
     */
    mode: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['horizontal', 'vertical']);
      },
      default: 'vertical',
    },
    /**
     * 垂直宽度
     *
     * @type {String}
     */
    width: {
      type: String,
      default: '240px',
    },
    /**
     * 展开的 Submenu 的 name 集合
     *
     * @type {Array}
     */
    openNames: {
      type: Array,
      default: () => [],
    },
    /**
     * 激活菜单的 name 值
     *
     * @type {String | Number}
     */
    activeName: {
      type: [String, Number],
    },
    /**
     * 是否开启手风琴模式，开启后每次至多展开一个子菜单
     *
     * @type {Boolean}
     */
    accordion: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, { emit }) {
    // data
    const data = reactive<Data>({
      /**
       * 展开的 Submenu 的 name 集合
       *
       * @type {Array}
       */
      openedNames: [],
      /**
       * 子菜单列表
       *
       * @type {Array}
       */
      menuItemList: [],
      /**
       * 下拉菜单列表
       *
       * @type {Array}
       */
      submenuList: [],
      /**
       * 当前激活的名称
       *
       * @type {String | Number}
       */
      currentActiveName: props.activeName,
      /**
       * 是否渲染完毕
       *
       * @type {Boolean}
       */
      ready: false,
    });

    // computed

    // 外部样式
    const wrapperClasses = computed(() => {
      let theme = props.theme;

      // 垂直 &&  primary
      if (props.mode === 'vertical' && props.theme === 'primary') {
        theme = 'light';
      }

      return [
        `${prefixCls}`,
        // 主题
        `${prefixCls}-${theme}`,
        {
          // 菜单类型
          [`${prefixCls}-${props.mode}`]: props.mode,
        },
      ];
    });

    // 外部样式
    const wrapperStyles = computed(() => {
      const style: {
        width?: string;
      } = {};

      // 垂直宽度
      if (props.mode === 'vertical') {
        style.width = props.width;
      }

      return style;
    });

    // methods

    // 激活当前子菜单
    const updateActiveName = (activeName?: string | number) => {
      // 是否有需要激活的name
      if (activeName) {
        data.currentActiveName = activeName;
      }

      // 没有菜单
      if (data.currentActiveName === undefined) {
        data.currentActiveName = -1;
      }

      // 子菜单列表
      data.submenuList
        .map((item) => item.submenu)
        .forEach((item) => {
          item.activeName(false);
        });

      // 菜单列表
      data.menuItemList.forEach((item) => {
        // 激活子菜单
        item.activeName(data.currentActiveName);
      });
    };

    // 激活子菜单
    const menuItemActive = (name: string | number) => {
      // 当前激活的名称
      data.currentActiveName = name;

      // 更新打开的菜单名称
      updateOpenKeys(name);

      emit('on-select', name);
    };

    // 发送选择事件
    const handleEmitSelectEvent = (name: string | number) => {
      emit('on-select', name);
    };

    // 更新打开的菜单名称
    const updateOpenKeys = (name) => {
      const names = [...data.openedNames];

      const index = names.indexOf(name);
      const submenuList = data.submenuList.map((item) => item.submenu);

      // 手风琴模式
      if (props.accordion) {
        // 关闭下拉菜单
        submenuList.forEach((item) => {
          item.data.opened = false;
        });
      }

      //  开的 Submenu 的 name 集合 有当前菜单
      if (index >= 0) {
        let currentSubmenu = null;

        // 关闭当前子菜单
        submenuList.forEach((item) => {
          if (item.name === name) {
            currentSubmenu = item;

            item.data.opened = false;
          }
        });

        if (currentSubmenu) {
          // 打开当前组件子菜单
          findComponentsUpward(currentSubmenu, 'ivue-menu-submenu').forEach(
            (item) => {
              item.data.opened = true;
            }
          );
        }

        // 子菜单列表全部关闭
        currentSubmenu.data.childSubmenuList
          .map((item) => item.submenu)
          .forEach((item) => {
            item.data.opened = false;
          });
      }
      // 没有当前菜单
      else {
        // 手风琴模式
        if (props.accordion) {
          let currentSubmenu = null;

          // 打开当前子菜单
          submenuList.forEach((item) => {
            if (item.name === name) {
              currentSubmenu = item;

              item.data.opened = true;
            }
          });

          if (currentSubmenu) {
            findComponentsUpward(currentSubmenu, 'ivue-menu-submenu').forEach(
              (item) => {
                item.data.opened = true;
              }
            );
          }
        } else {
          // 打开子菜单
          const submenuList = data.submenuList.map((item) => item.submenu);

          submenuList.forEach((item) => {
            if (item.name === name) {
              item.data.opened = true;
            }
          });
        }
      }

      // 获取当前打开的子菜单
      const openedNames = submenuList
        .filter((item) => item.data.opened)
        .map((item) => item.name);

      // 展开的 Submenu 的 name 集合
      data.openedNames = [...openedNames];

      // 当前展开的 Submenu 的 name 值数组
      emit('on-open-change', openedNames);
    };

    // 选择当前菜单
    const handleMenuItemSelect = (name: string | number) => {
      data.currentActiveName = name;

      emit('on-select', name);
    };

    // 展开子菜单
    const updateOpened = (openedNames?: any[]) => {
      // 是否有需要激活的菜单
      if (openedNames) {
        data.openedNames = openedNames;
      }

      const items = data.submenuList.map((item) => item.submenu);

      if (items.length) {
        items.forEach((item) => {
          // 展开子菜单
          if (data.openedNames.indexOf(item.name) > -1) {
            item.data.opened = true;
          }
          // 关闭子菜单
          else {
            item.data.opened = false;
          }
        });
      }
    };

    // provide

    provide(
      MenuContextKey,
      reactive({
        data,
        mode: props.mode,
        menuItemActive,
        handleEmitSelectEvent,
        updateOpenKeys,
        handleMenuItemSelect,
      })
    );

    // watch

    // 监听激活菜单的 name 值
    watch(
      () => props.activeName,
      (value) => {
        data.currentActiveName = value;
      }
    );

    // 监听当前激活的名称
    watch(
      () => data.currentActiveName,
      () => {
        updateActiveName();
      }
    );

    // 监听展开的 Submenu 的 name 集合
    watch(
      () => props.openNames,
      (value) => {
        data.openedNames = value;

        // 展开菜单
        updateOpened();
      }
    );

    // onMounted
    onMounted(() => {
      // 展开的 Submenu 的 name 集合
      data.openedNames = [...props.openNames];

      // 展开菜单
      updateOpened();

      nextTick(() => {
        // 激活子菜单
        updateActiveName();

        // 渲染完成
        data.ready = true;
      });
    });

    return {
      prefixCls,

      // data
      data,

      // computed
      wrapperClasses,
      wrapperStyles,
      updateOpenKeys,
      updateOpened,
      updateActiveName,
    };
  },
};
</script>
