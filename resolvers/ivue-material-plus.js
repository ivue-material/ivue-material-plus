'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function kebabCase(key) {
  const result = key.replace(/([A-Z])/g, " $1").trim();
  return result.split(" ").join("-").toLowerCase();
}
const pakPath = "ivue-material-plus/dist/unplugin-vue-components";
const basePath = "ivue-material-plus/dist/styles/base.css";
const noStylesComponents = [
  "ivue-content",
  "ivue-carousel-item",
  "ivue-bottom-nav-item",
  "ivue-breadcrumbs-item",
  "ivue-checkbox-group",
  "ivue-collapse-panel",
  "ivue-count-down",
  "ivue-count-up",
  "ivue-radio-group",
  "ivue-option",
  "ivue-option-group",
  "ivue-image-preview"
];
const useDependentComponents = [
  {
    name: "ivue-table",
    dependent: ["IvueTableColumn"]
  },
  {
    name: "ivue-tabs",
    dependent: ["IvueTabItem", "IvueTab"]
  },
  {
    name: "ivue-select",
    dependent: ["IvueOption", "IvueOptionGroup"]
  },
  {
    name: "ivue-steps",
    dependent: ["IvueStep"]
  }
];
function getSideEffects(componentsName, options) {
  if (!options.importStyle) {
    return;
  }
  if (options.singleFile) {
    return [
      `${pakPath}/styles/${componentsName}.css`
    ];
  }
  return [
    `${pakPath}/styles/reset.css`,
    `${pakPath}/styles/ivue-icon.css`,
    `${basePath}`,
    `${pakPath}/styles/${componentsName}.css`
  ];
}
const resolveComponent = (componentsName, options) => {
  let useDependentComponentsData = null;
  useDependentComponents.forEach((item) => {
    item.dependent.forEach((dependent) => {
      const _kebabCase = kebabCase(dependent);
      if (_kebabCase === componentsName) {
        useDependentComponentsData = {
          name: dependent,
          from: `${pakPath}/${options.ssr ? "lib" : "es"}`
        };
      }
    });
  });
  if (useDependentComponentsData) {
    return useDependentComponentsData;
  }
  return {
    name: options.name,
    from: `${pakPath}/${options.ssr ? "lib" : "es"}`,
    sideEffects: getSideEffects(componentsName, options)
  };
};
const resolveDirective = (name, options) => {
  const directives = {
    Loading: {
      name: "IvueLoading",
      importName: "ivue-loading",
      styleName: "ivue-loading",
      importStyle: true
    },
    Ripple: {
      name: "Ripple",
      importName: "ivue-ripple",
      styleName: "ivue-ripple",
      importStyle: true
    },
    ClickOutside: {
      name: "ClickOutside",
      importName: "ivue-click-outside",
      styleName: "ivue-click-outside",
      importStyle: false
    },
    Touch: {
      name: "Touch",
      importName: "ivue-touch",
      styleName: "ivue-touch",
      importStyle: false
    },
    LineClamp: {
      name: "LineClamp",
      importName: "ivue-line-clamp",
      styleName: "ivue-line-clamp",
      importStyle: true,
      singleFile: true
    }
  };
  const directive = directives[name];
  if (!directive) {
    return;
  }
  console.log("directive.name", name);
  return {
    name: directive.name,
    from: `${pakPath}/${options.ssr ? "lib" : "es"}`,
    sideEffects: getSideEffects(directive.styleName, {
      importStyle: directive.importStyle,
      singleFile: directive.singleFile
    })
  };
};
function IvueMaterialPlusResolver(options) {
  let optionsResolved = {
    ssr: false,
    ...options
  };
  return [
    {
      type: "component",
      resolve: (name) => {
        if (!name.match(/^Ivue[A-Z]/)) {
          return;
        }
        const _kebabCase = kebabCase(name);
        if ([...noStylesComponents].includes(_kebabCase)) {
          return resolveComponent(_kebabCase, {
            name,
            importStyle: false,
            ...optionsResolved
          });
        }
        return resolveComponent(_kebabCase, {
          name,
          importStyle: true,
          ...optionsResolved
        });
      }
    },
    {
      type: "directive",
      resolve: (name) => {
        return resolveDirective(name, optionsResolved);
      }
    }
  ];
}

exports.IvueMaterialPlusResolver = IvueMaterialPlusResolver;
//# sourceMappingURL=ivue-material-plus.js.map
