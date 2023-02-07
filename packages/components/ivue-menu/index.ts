import { withInstall, withNoopInstall } from '../../utils/install';
import Menu from './menu.vue';
import MenuItem from './menu-item.vue';
import Submenu from './submenu.vue';
import MenuGroup from './menu-group.vue';

export const IvueMenu = withInstall(Menu, {
  MenuItem,
  Submenu,
  MenuGroup,
});

export default IvueMenu;

export const IvueMenuItem = withNoopInstall(MenuItem);
export const IvueSubmenu = withNoopInstall(Submenu);
export const IvueMenuGroup = withNoopInstall(MenuGroup);

export * from './menu.vue';
export * from './menu-item.vue';
export * from './submenu.vue';
