export interface Props {
  move?: number;
  ratio: number;
  always: boolean;
  barSize: string;
  vertical: boolean;
}

export interface Data {
  thumbState: Partial<Record<'X' | 'Y', number>>;
  visible: boolean;
}
