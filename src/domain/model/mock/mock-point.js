import PointView from '../point.js';

const POINT_TYPE_LIST = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const generatePoint = (overrides = {}) => {
  const defaultPoint = {
    id: crypto.randomUUID(),
    basePrice: 100,
    dateFrom: '2019-03-18T10:30:00.000Z',
    dateTo: '2019-03-18T11:00:00.000Z',
    destination: 'chamonix',
    isFavorite: false,
    offers: [],
    type: 'taxi',
    ...overrides
  };

  return new PointView(defaultPoint);
};

export {generatePoint, POINT_TYPE_LIST};
