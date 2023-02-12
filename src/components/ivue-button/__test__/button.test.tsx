import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import Button from '@ivue-material-plus/components/ivue-button';
import { expect, describe, test } from 'vitest';

type ButtonStatus = 'primary'| 'light-primary'| 'dark-primary'| 'success'| 'warning'| 'error'

const prefixCls = 'ivue-button';

test('test button', () => {
  const app = createApp({}).use(Button);
  expect(app.component(Button.name)).toBeTruthy();
});

test('test button click', async ()=> {
  const onClick = () => {};
  const wrapper = mount(Button, {
    props: {
      onClick
    }
  });
  await wrapper.trigger('click');
  expect(wrapper.emitted()).toHaveProperty('click');
  wrapper.unmount();
});

describe('test button component props', () => {
  test('test button status', () => {
    ;['primary', 'light-primary', 'dark-primary', 'success', 'warning', 'error'].forEach((status: ButtonStatus) => {
      const wrapper = mount(Button, {
        props: {
          status
        }
      });
      expect(wrapper.find('button').classes()).toContain(`${prefixCls}--${status}`);
      wrapper.unmount();
    });
  });

  test('test button flat', () => {
    const wrapper = mount(Button, {
      props: {
        flat: true
      }
    });
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}--flat`);
    wrapper.unmount();
  });

  test('test button icon', () => {
    const wrapper = mount(Button,{
      props: {
        icon: true
      }
    });
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}--icon`);
    wrapper.unmount();
  });

  test('test button outline', () => {
    const wrapper = mount(Button,{
      props: {
        outline: true
      }
    });
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}--outline`);
    wrapper.unmount();
  });

  test('test button radius', () => {
    const wrapper = mount(Button,{
      props: {
        radius: true
      }
    });
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}--radius`);
    wrapper.unmount();
  });

  test('test button depressed', () => {
    const wrapper = mount(Button,{
      props: {
        depressed: true,
        flat: false
      }
    });
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}--depressed`);
    wrapper.unmount();
  });

  test('test button color', () => {
    ;['primary', 'light-primary', 'dark-primary', 'success', 'warning', 'error'].forEach((status: ButtonStatus) => {
      const wrapper = mount(Button, {
        props: {
          status,
          flat: true
        }
      });
      expect(wrapper.find('button').classes()).toContain(`${prefixCls}--${status}__color`);
      wrapper.unmount();
    });
  });
});
