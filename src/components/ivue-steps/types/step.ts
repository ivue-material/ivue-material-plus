export type Props = {
  title: string;
  content: string;
  status: string;
  icon: string;
};

export type Data = {
  stepNumber: string;
  currentStatus: string;
  nextError: boolean;
  index: number;
  textDirection: string;
  direction: string;
};
