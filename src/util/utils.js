import dayjs from 'dayjs';

export const getRandomValue = (minPrice, maxPrice) => Math.round(Math.random() * (maxPrice - minPrice) + minPrice);

export const getOffersFromTypes = (eventType, offerElements) => {
  let offerList = [];

  offerElements.forEach((offersElement) => {
    const {type, offers} = offersElement;

    if (type === eventType) {
      offerList = offers;
    }
  });

  return offerList;
};

export const getDestinationFromId = (idNumber, destinationElements) => {
  let destinationName = '';

  destinationElements.forEach((destinations) => {
    const {id, name} = destinations;

    if (id === idNumber) {
      destinationName = name;
    }
  });

  return destinationName;
};

export function updatePointData(points, updatedPoint) {
  return points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
}

export function sortByDay(pointFirst, pointSecond) {
  return new Date(pointFirst.dateFrom) - new Date(pointSecond.dateFrom);
}

export function sortByPrice(pointFirst, pointSecond) {
  return pointSecond.basePrice - pointFirst.basePrice;
}

export function sortByDuration(pointFirst, pointSecond) {
  return dayjs(pointSecond.dateTo).diff(dayjs(pointSecond.dateFrom)) -
    dayjs(pointFirst.dateTo).diff(dayjs(pointFirst.dateFrom));
}
