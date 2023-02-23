import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Card from '../index';

const IVUE = 'ivue is a vue component';

// TODO: Props.to | Props.target | Props.replace | Props.paddingStylesLinkage
describe('Card', () => {
  test('render test', () => {
    const wrapper = mount(() => <Card>{IVUE}</Card>);
    expect(wrapper.text()).toEqual(IVUE);
  });

  test('test card border', () => {
    const wrapper = mount(() => <Card border></Card>);
    expect(wrapper.classes()).toContain('ivue-card-border');
  });

  test('test card radius', () => {
    const wrapper = mount(() => <Card radius={12}></Card>);
    expect(wrapper.attributes('style')).toContain('border-radius: 12px');
  });

  test('test card hover', () => {
    const wrapper = mount(() => <Card disHover={true}></Card>);
    expect(wrapper.classes()).toContain('ivue-card-dis-hover');
  });

  test('test card shadow', () => {
    const wrapper = mount(() => <Card shadow={true}></Card>);
    expect(wrapper.classes()).toContain('ivue-card-shadow');
  });

  test('test slot', async () => {
    const title = '<div>ivue-test-title</div>';
    const extra = '<div>ivue-test-extra</div>';
    const wrapper = mount(Card, {
      slots: {
        title: title,
        extra: extra
      },
    });
    await wrapper.setProps({title: title});
    expect(wrapper.html()).toContain(title);
    expect(wrapper.html()).toContain(extra);
  });
});
