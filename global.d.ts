// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueAffix: typeof import('ivue-material-plus')['IvueAffix'];
  }
}

export {};
