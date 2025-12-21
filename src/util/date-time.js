const MONTH_LIST = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export const parseFormatDate = (str) => {
  const date = new Date(str);
  const day = date.getDate();
  const month = MONTH_LIST[date.getMonth()];
  return `${month} ${day}`;
};

export const parseFormatTime = (str) => {
  const date = new Date(str);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const parseFormatDateInput = (str) => {
  const date = new Date(str);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const calculateDuration = (dateFrom, dateTo) => {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  const diffMs = to - from;
  const diffMins = Math.floor(diffMs / 60000);

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
