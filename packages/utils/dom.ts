/* istanbul ignore next */
export const on = (
  element: HTMLElement | Document | Window,
  event: string,
  handler: any,
  useCapture = false
): void => {
  if (element && event && handler) {
    element.addEventListener(event, handler, useCapture);
  }
};

/* istanbul ignore next */
export const off = (
  element: HTMLElement | Document | Window,
  event: string,
  handler: any,
  useCapture = false
): void => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, useCapture);
  }
};
