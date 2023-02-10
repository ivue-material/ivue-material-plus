import { mount } from '@vue/test-utils';
import { describe, test, expect } from 'vitest';
import Avatar from '../index';
import { IMAGE_FAIL, IMAGE_SUCCESS, mockImageEvent } from '../../../test-utils/mork';

describe('Avatar', () => {
  mockImageEvent();

  test('render test', () => {
    const wrapper = mount(() => <Avatar />);
    expect(wrapper.find('.ivue-avatar').exists()).toBe(true);
  });

  test('size is string', () => {
    const wrapper = mount(() => <Avatar size={'12px'} />);
    expect(wrapper.attributes('style')).toContain(
      'height: 12px; width: 12px; line-height: 12px;'
    );
  });

  test('size is number', () => {
    const wrapper = mount(() => <Avatar size={12} />);
    expect(wrapper.attributes('style')).toContain(
      'height: 12px; width: 12px; line-height: 12px;'
    );
  });

  test('shape', () => {
    const wrapper = mount(() => <Avatar size={'12px'} shape={'square'} />);
    expect(wrapper.find('ivue-avatar-square').exists()).toBe(true);
  });

  test('color is string', () => {
    const wrapper = mount(() => <Avatar color={'red'} />);
    expect(wrapper.classes()).toContain('red');
  });

  test('color is array', () => {
    const colors = ['red', 'green', 'blue'];
    for (const color of colors) {
      const wrapper = mount(() => <Avatar color={color} />);
      expect(wrapper.classes()).toContain(`${color}`);
    }
  });

  test('icon avatar', () => {
    const wrapper = mount(() => <Avatar icon={'brightness_5'} />);
    expect(wrapper.find('i').exists()).toBe(true);
  });

  test('image avatar', () => {
    const wrapper = mount(() => <Avatar src={IMAGE_SUCCESS} />);
    expect(wrapper.find('img').exists()).toBe(true);
  });
});
