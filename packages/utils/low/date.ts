import { locale } from "./locale";

// 月 month 0-11
// 日 day 0-31
// 周 week 0-6
// 时 hours 0 - 23
// 分 minutes 0 - 59
// 秒 seconds 0 - 59
// 毫秒 0 - 999

const formatDisplay = (date: Date) => {
    var day = date.getDate();
    return `${locale.monthList[date.getMonth()]}-${day > 9 ? day : '0' + day} ${locale.dayList[date.getDay()]}`;
}

const formatDateDisplay = (date: Date) => {
    var day = date.getDate();
    return `${locale.monthList[date.getMonth()]}-${day > 9 ? day : '0' + day}`;
}

const formatMonth = (date: Date) => {
    return `${date.getFullYear()} ${locale.monthLongList[date.getMonth()]}`;
}

const getWeekDayArray = (firstDayOfWeek: number) => {
    const beforeArray = [];
    const afterArray = [];
    const dayAbbreviation = locale.dayAbbreviation;

    for (let i = 0; i < dayAbbreviation.length; i++) {
        if (i < firstDayOfWeek) {
            afterArray.push(dayAbbreviation[i]);
        } else {
            beforeArray.push(dayAbbreviation[i]);
        }
    }

    return beforeArray.concat(afterArray);
}

const getMonthList = () => {
    return locale.monthLongList;
}

const getDaysInMonth = (d: Date) => {
    const resultDate = getFirstDayOfMonth(d);

    resultDate.setMonth(resultDate.getMonth() + 1);
    resultDate.setDate(resultDate.getDate() - 1);

    return resultDate.getDate();
}

const getFirstDayOfMonth = (d: Date) => {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

const getMonthArray = (d: Date) => {
    const length = 3;
    const months = [];
    let month = [];
    for (let i = 0; i < 12; i++) {
        month.push(new Date(d.getFullYear(), i, 1, d.getHours(), d.getMinutes()));
        if (month.length === length) {
            months.push(month);
            month = [];
        }
    }

    return months;
}

const getWeekArray = (d: Date, firstDayOfWeek: number) => {
    const dayArray = [];
    const daysInMonth = getDaysInMonth(d);
    const weekArray: any[] = [];
    let week: any[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
        dayArray.push(new Date(d.getFullYear(), d.getMonth(), i, d.getHours(), d.getMinutes()));
    }

    const addWeek = (week: any[]) => {
        const emptyDays = 7 - week.length;
        for (let i = 0; i < emptyDays; ++i) {
            week[weekArray.length ? 'push' : 'unshift'](null);
        }
        weekArray.push(week);
    };

    dayArray.forEach((day) => {
        if (week.length > 0 && day.getDay() === firstDayOfWeek) {
            addWeek(week);
            week = [];
        }
        week.push(day);
        if (dayArray.indexOf(day) === dayArray.length - 1) {
            addWeek(week);
        }
    });

    return weekArray;
}

const addDays = (d: Date, days: number) => {
    const newDate = cloneDate(d);
    newDate.setDate(d.getDate() + days);
    return newDate;
}

const addMonths = (d: Date, months: number) => {
    const newDate = cloneDate(d);
    newDate.setMonth(d.getMonth() + months);
    return newDate;
}

const addYears = (d: Date, years: number) => {
    const newDate = cloneDate(d);
    newDate.setFullYear(d.getFullYear() + years);
    return newDate;
}

const cloneDate = (d: Date) => {
    return new Date(d.getTime());
}

const cloneAsDate = (d: Date) => {
    const clonedDate = cloneDate(d);

    clonedDate.setHours(0, 0, 0, 0);
    return clonedDate;
}

const isBeforeDate = (d1: Date, d2: Date) => {
    const date1 = cloneAsDate(d1);
    const date2 = cloneAsDate(d2);

    return (date1.getTime() < date2.getTime());
}

const isAfterDate = (d1: Date, d2: Date) => {
    const date1 = cloneAsDate(d1);
    const date2 = cloneAsDate(d2);

    return (date1.getTime() > date2.getTime());
}

const isBetweenDates = (dateToCheck, startDate, endDate) => {
    return (!(isBeforeDate(dateToCheck, startDate)) &&
        !(isAfterDate(dateToCheck, endDate)));
}

const isEqualDate = (d1: Date, d2: Date) => {
    return d1 && d2 &&
        (d1.getFullYear() === d2.getFullYear()) &&
        (d1.getMonth() === d2.getMonth()) &&
        (d1.getDate() === d2.getDate());
}

const monthDiff = (d1: Date, d2: Date) => {
    let m;
    m = (d1.getFullYear() - d2.getFullYear()) * 12;
    m += d1.getMonth();
    m -= d2.getMonth();
    return m;
}

const yearDiff = (d1: Date, d2: Date) => {
    return ~~(monthDiff(d1, d2) / 12);
}