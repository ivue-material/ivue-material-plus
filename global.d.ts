// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueAffix: typeof import('ivue-material-plus')['IvueAffix'];
    IvueInput: typeof import('ivue-material-plus')['IvueInput'];
    IvueIcon: typeof import('ivue-material-plus')['IvueIcon'];
    IvueSvgLoader: typeof import('ivue-material-plus')['IvueSvgLoader'];
    IvueButton: typeof import('ivue-material-plus')['IvueButton'];
  }

  interface ComponentCustomProperties {
    $loading: typeof import('ivue-material-plus')['IvueLoadingService'];
  }
}

export {};
