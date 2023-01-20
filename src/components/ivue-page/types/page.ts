export interface Props {
  modelValue: number;
  showTotal: boolean;
  total: number;
  prevIcon: string;
  nextIcon: string;
  disabled: boolean;
  pageSize: number;
  pagerCount: number;
  showSizer: boolean;
  placement: string;
  transfer: boolean;
  pageSizeOpts: any[];
  pageSizeText: string;
  showElevator: boolean;
  elevatorText: any[];
  small: boolean;
  simple: boolean;
}

export interface Data {
  currentPage: number;
  currentPageSize: number;
  showPrevMore: boolean;
  showNextMore: boolean;
}
