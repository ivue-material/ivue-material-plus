<p align="center">
  <a href="https://lovevuerk.com/plus/" target="_blank">
    <img width="100"src="https://cdn.lovevuerk.com/plus/assets/logo-96761cb2.png"/>
  </a>
</p>

## IVue Plus Official website

**<a href="https://lovevuerk.com/plus/" target="_blank">https://lovevuerk.com/plus/</a>**

IVue is a semantic component framework for Vue. It aims to provide clean, semantic and reusable components.
Provides more than 50 commonly used low-level components.

iVue Created according to Google's **<a href="https://material.io/" target="_blank">Material Design Spec</a>**

## Browser Support

Run on browsers that support ES2018 and ResizeObserver. If you really need to support older browsers, add Babel and the corresponding Polyfill yourself
Since Vue 3 no longer supports IE11, this library no longer supports IE browser

## Installation

Using npm:

```javascript
 npm install ivue-material-plus --save
```

Using a script tag for global use:

```javascript
<link rel="stylesheet" href="//unpkg.com/ivue-material-plus/dist/styles/index.css">
<script src="https://unpkg.com/vue@next"></script>
<script src="//unpkg.com/ivue-material-plus"></script>
```

You can see the latest version resources at <a href="https://unpkg.com/ivue-material-plus/" target="_blank">unpkg.com/ivue-material-plus</a>

## Usage

```javascript
import Vue from 'vue';
import IvueMaterialPlus from 'ivue-material-plus';

Vue.use(IvueMaterialPlus);
```

Using css via import:

```javascript
import 'ivue-material-plus/dist/styles/index.css';
```

## Import On Demand

### import automatically

First you need to install the two plugins `unplugin-vue-components` and `unplugin-auto-import`

### Vite

```
// vite.config.js
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { IvueMaterialPlusResolver } from 'ivue-material-plus/resolvers/ivue-material-plus'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [IvueMaterialPlusResolver()],
    }),
    Components({
      resolvers: [IvueMaterialPlusResolver()],
    }),
  ],
})
```

### Webpack

```
// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
import { IvueMaterialPlusResolver } from 'ivue-material-plus/resolvers/ivue-material-plus'

module.exports = {
  // ...
  plugins: [
    AutoImport({
      resolvers: [IvueMaterialPlusResolver()],
    }),
    Components({
      resolvers: [IvueMaterialPlusResolver()],
    }),
  ],
}
```

For more packaging (Rollup, Vue CLI) and configuration tools, please refer to [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components#installation) 和 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import#install)

### Load components on demand

With the help of the plug-in [babel-plugin-import](https://github.com/umijs/babel-plugin-import) can be achieved by
Components need to be loaded to reduce file size. First install and configure in file `.babelrc` or in webpack `babel-loader`

```
npm install babel-plugin-import --save-dev

// .babelrc or babel-loader
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "ivue-material-plus",
        "libraryDirectory": "dist/unplugin-vue-components/es"
      },
      "ivue-material-plus"
    ]
  ],
}
```

Then introduce components on demand in this way, you can reduce the size

```
import { IvueAffix, IvueInput } from 'ivue-material-plus';
app.component(IvueAffix.name, IvueAffix);
app.component(IvueInput.name, IvueInput);
```

### Special Reminder

on demand references still need to import styles, that is, execute `import 'ivue-material-plus/dist/styles/index.css'` in `main.js` or the root component;

## Community

Contribute: Contact us WeChat or via mail to jianzhongmin@foxmail.com. PRs welcome!

## License

**<a href="https://opensource.org/licenses/MIT">MIT</a>**

Copyright (c) 2019-present, IVue
