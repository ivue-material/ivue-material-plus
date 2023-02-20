<script lang="ts">
import { defineComponent, computed, inject, h, getCurrentInstance } from 'vue';

// tokens
import {
  BreadcrumbContextKey,
  BreadcrumbContext,
} from '@ivue-material-plus/tokens';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

// breadcrumb-item
import { breadcrumbItemProps } from './breadcrumb-item';

// type
import type { ComponentInternalInstance } from 'vue';

const prefixCls = 'ivue-breadcrumb-item';

export default defineComponent({
  name: prefixCls,
  props: breadcrumbItemProps,
  setup(props, { slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    const parent = inject(BreadcrumbContextKey) as BreadcrumbContext;

    // computed

    // classes
    const classes = computed(() => {
      return [
        bem.b(),
        {
          [bem.is('link')]: props.to,
        },
      ];
    });

    return () => {
      const router = proxy?.$router;

      return h(
        'span',
        {
          class: classes.value,
        },
        [
          h(
            'span',
            {
              class: bem.e('inner'),
              onClick: () => {
                // 没有路由跳转
                if (!props.to) {
                  return;
                }

                if (!router) {
                  return;
                }

                // 是否开启  replace
                props.replace
                  ? router.replace(props.to)
                  : router.push(props.to);
              },
            },
            slots && slots.default?.()
          ),
          //  下标
          h(
            'span',
            {
              class: bem.e('divider'),
            },
            typeof parent.divider === 'function'
              ? parent.divider()
              : parent.divider
          ),
        ]
      );
    };
  },
});
</script>
