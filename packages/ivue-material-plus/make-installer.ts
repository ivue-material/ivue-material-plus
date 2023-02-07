// import { provideGlobalConfig } from '@element-plus/hooks'
export const INSTALLED_KEY = 'INSTALLED_KEY';
import { version } from './version';

import type { App, Plugin } from '@vue/runtime-core';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    if (app[INSTALLED_KEY]) return;

    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));

    // if (options) provideGlobalConfig(options, app, true)
  };

  return {
    version,
    install,
  };
};
