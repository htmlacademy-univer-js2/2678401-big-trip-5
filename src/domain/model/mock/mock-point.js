import {offerList} from './mock-offer.js';
import {destinationList} from './mock-destination.js';
import {EVENT_TYPE_LIST} from '/src/util/data.js';
import {getRandomValue, getOffersFromTypes, getDestinationFromId} from '/src/util/utils.js';

const MIN_PRICE = 1000;
const MAX_PRICE = 5000;
const FALSE_NUMBER = 0;
const TRUE_NUMBER = 1;

export const pointList = [
  {
    'id': '1',
    'basePrice': getRandomValue(MIN_PRICE, MAX_PRICE),
    'dateFrom': '2025-03-28T22:55:56.845Z',
    'dateTo': '2025-03-29T22:56:01.234Z',
    'destination': getDestinationFromId('1', destinationList),
    'isFavorite': Boolean(getRandomValue(FALSE_NUMBER, TRUE_NUMBER)),
    'offers': getOffersFromTypes(EVENT_TYPE_LIST[0], offerList),
    'type': EVENT_TYPE_LIST[0]
  },
  {
    'id': '2',
    'basePrice': getRandomValue(MIN_PRICE, MAX_PRICE),
    'dateFrom': '2025-03-30T00:10:30.555Z',
    'dateTo': '2025-03-30T08:00:00.123Z',
    'destination': getDestinationFromId('2', destinationList),
    'isFavorite': Boolean(getRandomValue(FALSE_NUMBER, TRUE_NUMBER)),
    'offers': getOffersFromTypes(EVENT_TYPE_LIST[1], offerList),
    'type': EVENT_TYPE_LIST[1]
  },
  {
    'id': '3',
    'basePrice': getRandomValue(MIN_PRICE, MAX_PRICE),
    'dateFrom': '2025-03-31T12:34:56.789Z',
    'dateTo': '2025-04-01T00:00:00.001Z',
    'destination': getDestinationFromId('3', destinationList),
    'isFavorite': Boolean(getRandomValue(FALSE_NUMBER, TRUE_NUMBER)),
    'offers': getOffersFromTypes(EVENT_TYPE_LIST[2], offerList),
    'type': EVENT_TYPE_LIST[2]
  },
  {
    'id': '4',
    'basePrice': getRandomValue(MIN_PRICE, MAX_PRICE),
    'dateFrom': '2025-04-05T18:22:44.666Z',
    'dateTo': '2025-05-10T05:05:05.505Z',
    'destination': getDestinationFromId('4', destinationList),
    'isFavorite': Boolean(getRandomValue(FALSE_NUMBER, TRUE_NUMBER)),
    'offers': getOffersFromTypes(EVENT_TYPE_LIST[3], offerList),
    'type': EVENT_TYPE_LIST[3]
  }
];
