/*  eslint-disable */

// 语言
export type Locale = {
  before?: string
  after?: string
  just?: string
  seconds?: string
  minutes?: string
  hours?: string
  days?: string
}

// 判断传入时间戳是否早于当前时间戳
const isEarly = (timeStamp: number, currentTime: number) => {
  return timeStamp <= currentTime;
};


// 果传入的数值小于10，即位数只有1位，则在前面补充0
export const getHandledValue = (num: number) => {
  return num < 10 ? '0' + num : num;
};

// 时间字符串的格式类型
export const getDate = (timeStamp: number, startType?: string) => {
  const d = new Date(timeStamp);

  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const day = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());

  // 结果字符串
  let resultStr = '';

  // 年
  if ((startType === 'year') || (startType === 'datetime')) {
    // yyyy-mm-dd h:m:s
    resultStr = `${year}-${month}-${day} ${hours}:${minutes}:${second}`
  }
  // 日期
  else if (startType === 'date') {
    resultStr = `${year}-${month}-${day}`;
  }
  // 其他日期
  else {
    // mm-dd h:m:s
    resultStr = `${month}-${day} ${hours}:${minutes}`
  }

  return resultStr
}

// 获取相对时间
export const getRelativeTime = (timeStamp: number, locale: Locale = {}, dateStartType?: string, dateFunction?: Function) => {
  // 当前时间
  const currentTime = new Date().getTime();

  // 判断传入时间戳是否早于当前时间戳
  const _isEarly = isEarly(timeStamp, currentTime);

  // 获取两个时间戳差值
  let diff: number = currentTime - timeStamp;

  // 结果字符串
  let resultStr = '';

  // 当前时间之后
  if (!_isEarly) {
    diff = -diff;
  }

  // 最后的字符串
  const endStr = _isEarly ? (locale.before || '前') : (locale.after || '后');

  // 刚刚
  if (diff < 1000) {
    resultStr = locale.just || '刚刚';
  }
  // 秒 -> 少于等于59秒
  else if (diff < 60000) {
    resultStr = `${parseInt(`${diff / 1000}`)}${(locale.seconds || '秒')}${endStr}`;
  }
  // 分钟 -> 多于59秒，少于等于59分钟59秒
  else if (diff >= 60000 && diff < 3600000) {
    resultStr = `${Math.floor(diff / 60000)}${(locale.minutes || '分钟')}${endStr}`;
  }
  // 小时 -> 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff >= 3600000 && diff < 86400000) {
    resultStr = `${Math.floor(diff / 3600000)}${(locale.hours || '小时')}${endStr}`;
  }
  // 天 -> 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff >= 86400000 && diff < 2623860000) {
    resultStr = `${Math.floor(diff / 86400000)}${(locale.days || '天')}`
  }
  // 月 -> 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff >= 2623860000 && diff <= 31567860000 && _isEarly) {
    resultStr = getDate(timeStamp, dateStartType);
  }
  // 年 -> 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else {
    resultStr = getDate(timeStamp, 'year');
  }

  // 自定义日期方法
  if (dateFunction) {
    // 时间搓, 获取两个时间戳差值, 判断传入时间戳是否早于当前时间戳
    resultStr = dateFunction(timeStamp, diff, _isEarly)
  }

  return resultStr;
};
