// 允许选择的日期
export default function isDateAllowed(
  date: string,
  min?: string,
  max?: string,
  allowedFn?: (date: string) => boolean
) {
  return (
    (!allowedFn || allowedFn(date)) &&
    (!min || date >= min) &&
    (!max || date <= max)
  );
}
