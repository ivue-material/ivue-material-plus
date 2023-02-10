// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueAffix: typeof import('ivue-material-plus')['IvueAffix'];
    IvueInput: typeof import('ivue-material-plus')['IvueInput'];
    IvueIcon: typeof import('ivue-material-plus')['IvueIcon'];
    IvueSvgLoader: typeof import('ivue-material-plus')['IvueSvgLoader'];
    IvueButton: typeof import('ivue-material-plus')['IvueButton'];
    IvueAvatar: typeof import('ivue-material-plus')['IvueAvatar'];
    IvueBackTop: typeof import('ivue-material-plus')['IvueBackTop'];
    IvueBadge: typeof import('ivue-material-plus')['IvueBadge'];
    IvueCarousel: typeof import('ivue-material-plus')['IvueCarousel'];
    IvueCarouselItem: typeof import('ivue-material-plus')['IvueCarouselItem'];
    IvueForm: typeof import('ivue-material-plus')['IvueForm'];
    IvueFormItem: typeof import('ivue-material-plus')['IvueFormItem'];
    IvueSwitch: typeof import('ivue-material-plus')['IvueSwitch'];
  }

  interface ComponentCustomProperties {
    $loading: typeof import('ivue-material-plus')['IvueLoadingService'];
  }
}

export {};
