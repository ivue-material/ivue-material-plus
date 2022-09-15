import type IvueInput from '../ivue-input/index.vue';
import type MenuItem from './menu-item.vue';

export type IvueInputInstance = InstanceType<typeof IvueInput>
export type MenuItemInstance = InstanceType<typeof MenuItem>

export type tmpItem = {
  label?: string
  value?: string
}

export type result = {
  label?: string
  value?: string
}

export type options = {
  label?: string
  value?: string
  loading?: boolean,
  disabled?: boolean,
  children?: []
}
