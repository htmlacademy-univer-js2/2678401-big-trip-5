import dayjs from 'dayjs';

export const parseFormatDate = (str) => {
  if (!str) {
    return '';
  }
  return dayjs(str).format('MMM D').toUpperCase();
};

export const parseFormatTime = (str) => {
  if (!str) {
    return '';
  }
  return dayjs(str).format('HH:mm');
};

export const parseFormatDateInput = (str) => {
  if (!str) {
    return '';
  }

  return dayjs(str).format('DD/MM/YY HH:mm');
};

export const calculateDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }

  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);
  const diffMins = Math.max(0, to.diff(from, 'minute'));

  if (diffMins < 60) {
    return `${diffMins}M`;
  }

  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (minutes === 0) {
    return `${hours}H`;
  }

  return `${hours}H ${minutes}M`;
};
