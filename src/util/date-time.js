import dayjs from 'dayjs';
import {TIME_SUFFIXES_LIST} from './data.js';

export function parseFormatDate(date, format) {
  return dayjs(date).format(format);
}

export function parseFormatDuration(dateFrom, dateTo) {
  const startTime = dayjs(dateFrom);
  const endTime = dayjs(dateTo);
  const durationMinutes = endTime.diff(startTime, 'minute');

  const durationDays = Math.floor(durationMinutes / 1440);
  const remainingMinutes = durationMinutes % 1440;
  const durationHours = Math.floor(remainingMinutes / 60);
  const durationsMinutes = remainingMinutes % 60 + 1;

  const durationElements = [durationDays, durationHours, durationsMinutes];
  const durationResult = [];

  for (let i = 0; i < durationElements.length; i++) {
    const value = durationElements[i];
    if (value > 0) {
      const suffix = TIME_SUFFIXES_LIST[i];
      const paddedValue = value < 10 ? `0${value}` : value;
      durationResult.push(`${paddedValue}${suffix}`);
    }

  }

  return durationResult.join(' ') || '00M';
}

export function isPointPresent(point) {
  return dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo));
}

export function isPointFuture(point) {
  return dayjs().isBefore(dayjs(point.dateTo));
}

export function isPointPast(point) {
  return dayjs().isAfter(dayjs(point.dateFrom));
}
