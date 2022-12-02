export interface Props {
  shape: string;
  src: string;
  icon: string;
  size: number | string;
  color?: string | any[];
  textColor?: string;
}

export interface Data {
  isSlotShow: boolean;
  slotScale: number;
  slotWidth: number;
}
