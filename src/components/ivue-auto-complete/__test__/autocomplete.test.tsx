import { nextTick, reactive } from 'vue';
import { mount } from '@vue/test-utils';
import { expect, vi, beforeEach, describe, test } from 'vitest';
import AutoComplete from '../index';

const _mount = () =>
  mount({
    setup() {
      const state = reactive({
        value: '',
        list: ['Rust', 'Go', 'TypeScript', 'Python'],
      });

      return () => (
        <AutoComplete
          ref="autocomplete"
          list={state.list}
          v-model={state.value}
        />
      );
    },
  });

describe('autoComplete', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('placeholder', async () => {
    const wrapper = _mount();
    await nextTick();

    await wrapper.setProps({ placeholder: 'autoComplete' });
    expect(wrapper.find('input').attributes('placeholder')).toBe(
      'autoComplete'
    );

    await wrapper.setProps({ placeholder: 'placeholder' });
    expect(wrapper.find('input').attributes('placeholder')).toBe('placeholder');
  });
});
