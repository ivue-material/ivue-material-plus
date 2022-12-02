import type { Store } from '../../store';
import type { Sort, SummaryMethod } from '../../table/defaults';

export interface TableFooter {
  fixed?: string
  store?: Store
  summaryMethod?: SummaryMethod
  sumText?: string
  border?: boolean
  defaultSort?: Sort
}

export interface Props {
  border?: boolean;
  store?: Store;
  summaryMethod?: SummaryMethod;
  sumText?: string;
  defaultSort?: Sort;
}
