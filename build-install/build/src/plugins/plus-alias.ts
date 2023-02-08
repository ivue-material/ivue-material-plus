import { PKG_NAME, PKG_PREFIX } from '@ivue-material-plus/build-constants';

import type { Plugin } from 'rollup';

export function PlusAlias(): Plugin {
  const themeChalk = 'styles';
  const sourceThemeChalk = `${PKG_PREFIX}/${themeChalk}` as const;
  const bundleThemeChalk = `${PKG_NAME}/${themeChalk}` as const;

  return {
    name: 'alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) {
        return;
      }

      // 替换 @ivue-material-plus to ivue-material-plus
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: 'absolute',
      };
    },
  };
}
