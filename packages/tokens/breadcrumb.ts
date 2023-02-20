import { BreadcrumbProps } from '@ivue-material-plus/components/ivue-breadcrumb';

// type
import type { InjectionKey, Slot } from 'vue';

export type BreadcrumbContext = {
  props: BreadcrumbProps;
  divider: string | Slot;
};

export const BreadcrumbContextKey: InjectionKey<BreadcrumbContext> =
  Symbol('ivue-breadcrumb');
