<script lang="ts">
import { defineComponent, computed, inject, h } from 'vue';

// type
import { BreadcrumbContextKey } from '../ivue-breadcrumb/breadcrumb';
import type { Props } from './breadcrumb-item';

const prefixCls = 'ivue-breadcrumb-item';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 路由跳转对象，同 vue-router 的 to
         *
         * @type {String, Object}
         */
        to: {
            type: [String, Object],
            default: '',
        },
        /**
         * 在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录
         *
         * @type {Boolean}
         */
        replace: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: Props) {
        const parent = inject(BreadcrumbContextKey);

        // computed

        // classes
        const classes = computed(() => {
            return [
                prefixCls,
                {
                    ['is-link']: props.to,
                },
            ];
        });

        return {
            prefixCls,

            // 下标
            divider: parent?.divider,

            // computed
            classes,
        };
    },
    render() {
        return h(
            'span',
            {
                class: this.classes,
            },
            [
                h(
                    'span',
                    {
                        class: `${prefixCls}__inner`,
                        onClick: () => {
                            // 没有路由跳转
                            if (!this.to) {
                                return;
                            }

                            if (!this.$router) {
                                return;
                            }

                            // 是否开启  replace
                            this.replace
                                ? this.$router.replace(this.to)
                                : this.$router.push(this.to);
                        },
                    },
                    this.$slots.default()
                ),
                //  下标
                h(
                    'span',
                    {
                        class: 'ivue-breadcrumb--divider',
                    },
                    typeof this.divider === 'function'
                        ? this.divider()
                        : this.divider
                ),
            ]
        );
    },
});
</script>
