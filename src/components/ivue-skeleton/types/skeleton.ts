export interface Props {
  loading: boolean;
  throttle: number;
  total: number;
  paragraph:
    | number
    | {
        rows: number;
        width: any[];
      };
}
