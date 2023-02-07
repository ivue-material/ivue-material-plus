export interface Props {
  showSizer?: boolean;
  pageSize?: number;
  placement?: string;
  transfer: boolean;
  disabled?: boolean;
  pageSizeOpts?: any[];
  pageSizeText?: string;
  showElevator?: boolean;
  elevatorText?: any[];
  currentPage?: number;
  allPages?: number;
}

export interface Data {
  timeout: ReturnType<typeof setTimeout> | null;
  zIndex: number;
  disableCloseUnderTransfer: boolean;
  isInput: boolean;
  currentTargetFocus: boolean;
  closeDelay: number;
}
