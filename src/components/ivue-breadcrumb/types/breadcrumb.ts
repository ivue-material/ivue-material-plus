import type { InjectionKey } from 'vue';

export interface Props {
  divider: string;
  justifyCenter: boolean;
  justifyEnd: boolean;
}

export type BreadcrumbContext = {
  props: Props;
  divider: string;
};

export const BreadcrumbContextKey: InjectionKey<BreadcrumbContext> =
  Symbol('ivue-breadcrumb');
