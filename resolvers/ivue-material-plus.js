function kebabCase(key) {
  const result = key.replace(/([A-Z])/g, " $1").trim();
  return result.split(" ").join("-").toLowerCase();
}
const pakPath = "ivue-material-plus/dist/unplugin-vue-components";
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
  "ivue-option-group"
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
  return [
    `${pakPath}/styles/reset.css`,
    "ivue-material-plus/dist/styles/color.css",
    `${pakPath}/styles/ivue-icon.css`,
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
          from: `${pakPath}/es`
        };
      }
    });
  });
  if (useDependentComponentsData) {
    return useDependentComponentsData;
  }
  return {
    from: `${pakPath}/es/${componentsName}`,
    sideEffects: getSideEffects(componentsName, options)
  };
};
const resolveDirective = (name) => {
  const directives = {
    Loading: {
      name: "IvueLoadingDirective",
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
    }
  };
  const directive = directives[name];
  if (!directive) {
    return;
  }
  return {
    name: directive.name,
    from: `${pakPath}/es/${directive.importName}`,
    sideEffects: getSideEffects(directive.styleName, {
      importStyle: directive.importStyle
    })
  };
};
function IvueMaterialPlusResolver() {
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
            importStyle: false
          });
        }
        return resolveComponent(_kebabCase, {
          importStyle: true
        });
      }
    },
    {
      type: "directive",
      resolve: (name) => {
        return resolveDirective(name);
      }
    }
  ];
}

export { IvueMaterialPlusResolver };
//# sourceMappingURL=ivue-material-plus.js.map
