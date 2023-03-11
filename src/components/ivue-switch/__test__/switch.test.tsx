import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Switch from '../index';

describe('Switch', () => {
  test('render', () => {
    const wrapper = mount(() => <Switch />);
    expect(wrapper.html()).toContain('ivue-switch');
  });

  test('disabled', () => {
    const wrapper = mount(() => <Switch disabled/>);
    expect(wrapper.classes()).toContain('ivue-switch-disabled');
  });

  test('size', () => {
    const wrapper = mount(() => <Switch size='large'/>);
    expect(wrapper.find('.ivue-switch-large').exists()).toBe(true);
  });

  test('emboss', () => {
    const wrapper = mount(() => <Switch emboss/>);
    expect(wrapper.find('.ivue-switch-emboss--wrapper').exists()).toBe(true);
  });

  test('loading', () => {
    const wrapper = mount(() => <Switch loading/>);
    expect(wrapper.find('.ivue-switch-loading').exists()).toBe(true);
  });

  test('color', () => {
    const wrapper = mount(() => <Switch modelValue={true} color={'#000'}/>);
    expect(wrapper.attributes('style')).toContain('color: rgb(0, 0, 0)');
  });
});
