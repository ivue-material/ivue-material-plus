import IvueListItemMixin from '../../utils/mixins/ivue-list-item';
import IvueListItemContent from './ivue-list-item-content';

import { h, defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'ivue-list-item-default',
    mixins: [IvueListItemMixin],
    setup(props: any, { slots }) {
        const rippleDisabled = ref(props.rippleDisabled).value;

        return () => h('div', {
            class: 'ivue-list-item-default'
        }, [h(IvueListItemContent, {
            rippleDisabled
        }, slots)]);

    },
});
