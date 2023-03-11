import { mount } from '@vue/test-utils';
import { describe, test, expect } from 'vitest';
import BottomNav from '../index';
import BottomNavItem from '../../ivue-bottom-nav-item';

describe('BottomNav', () => {
  test('render __test__', () => {
    const wrapper = mount(() => <BottomNav />);
    expect(wrapper.find('.ivue-bottom-nav').exists()).toBe(true);
  });

  test('height', () => {
    const wrapper = mount(() => <BottomNav height={50} />);
    expect(wrapper.attributes('style')).toContain('height: 50px;');
  });

  test('position', () => {
    const wrapper = mount(() => <BottomNav position={'absolute'} />);
    expect(wrapper.classes()).toContain('ivue-bottom-nav--absolute');
  });

  test('visible', () => {
    const wrapper = mount(() => <BottomNav visible={true} />);
    expect(wrapper.classes()).toContain('ivue-bottom-nav--active');
  });

  test('items', () => {
    const wrapper = mount(() => (
      <BottomNav>
        <BottomNavItem color="primary" name="home"/>
        <BottomNavItem color="primary" name="settings"/>
        <BottomNavItem color="primary" name="account_box"/>
      </BottomNav>
    ));
    expect(wrapper.findAllComponents(BottomNavItem).length).toBe(3);
  });
});
