'use strict';
import { dateEffect } from './effect';
import { locale } from './locale';

type IDateInstance = InstanceType<typeof Date> & {
  getYear(): number
}

type IDateObject = Date | string | number

// 时间日期格式转换
export function dateFormatter(obj: IDateObject, fmt: string, isFullYear: boolean = true) {
  var str = fmt;
  const week = locale.dayAbbreviation;
  const date = dateEffect(obj) as IDateInstance;

  str = isFullYear ? str.replace(/yyyy|YYYY/, date.getFullYear().toString()) : str.replace(
    /yy|YY/,
    date.getYear() % 100 > 9 ?
      (date.getYear() % 100).toString() :
      "0" + (date.getYear() % 100)
  );
  str = str.replace(
    /MM/,
    date.getMonth() + 1 > 9 ?
      (date.getMonth() + 1).toString() :
      "0" + (date.getMonth() + 1)
  );
  str = str.replace(/M/g, (date.getMonth() + 1).toString());
  str = str.replace(/w|W/g, week[date.getDay()]);
  str = str.replace(
    /dd|DD/,
    date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate()
  );
  str = str.replace(/d|D/g, date.getDate().toString());
  str = str.replace(
    /hh|HH/,
    date.getHours() > 9 ? date.getHours().toString() : "0" + date.getHours()
  );
  str = str.replace(/h|H/g, date.getHours().toString());
  str = str.replace(
    /mm/,
    date.getMinutes() > 9 ?
      date.getMinutes().toString() :
      "0" + date.getMinutes()
  );
  str = str.replace(/m/g, date.getMinutes().toString());
  str = str.replace(
    /ss|SS/,
    date.getSeconds() > 9 ?
      date.getSeconds().toString() :
      "0" + date.getSeconds()
  );
  str = str.replace(/s|S/g, date.getSeconds().toString());

  return str;
}
