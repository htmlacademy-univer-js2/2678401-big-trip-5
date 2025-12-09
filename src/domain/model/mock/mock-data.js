import {generatePoint} from './mock-point.js';
import {generateDestination} from './mock-destination.js';
import {generateOffer} from './mock-offer.js';

const DESTINATION_LIST = [
  generateDestination({
    id: 'amsterdam',
    name: 'Amsterdam',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    pictures: [
      {src: 'img/photos/1.jpg', description: 'Amsterdam landscape'},
      {src: 'img/photos/2.jpg', description: 'Amsterdam landscape'}
    ]
  }),
  generateDestination({
    id: 'chamonix',
    name: 'Chamonix',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    pictures: [
      {src: 'img/photos/1.jpg', description: 'Chamonix landscape'},
      {src: 'img/photos/2.jpg', description: 'Chamonix landscape'},
      {src: 'img/photos/3.jpg', description: 'Chamonix landscape'},
      {src: 'img/photos/4.jpg', description: 'Chamonix landscape'},
      {src: 'img/photos/5.jpg', description: 'Chamonix landscape'}
    ]
  }),
  generateDestination({
    id: 'geneva',
    name: 'Geneva',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    pictures: [
      {src: 'img/photos/1.jpg', description: 'Geneva landscape'},
      {src: 'img/photos/2.jpg', description: 'Geneva landscape'},
      {src: 'img/photos/3.jpg', description: 'Geneva landscape'}
    ]
  })
];

const OFFERS_BY_TYPE = {
  taxi: [
    generateOffer({id: 'taxi-1', title: 'Order Uber', price: 20}),
    generateOffer({id: 'taxi-2', title: 'Add luggage', price: 30}),
    generateOffer({id: 'taxi-3', title: 'Switch to comfort', price: 100})
  ],
  flight: [
    generateOffer({id: 'flight-1', title: 'Add luggage', price: 50}),
    generateOffer({id: 'flight-2', title: 'Switch to comfort', price: 80}),
    generateOffer({id: 'flight-3', title: 'Add meal', price: 15}),
    generateOffer({id: 'flight-4', title: 'Choose seats', price: 5})
  ],
  drive: [
    generateOffer({id: 'drive-1', title: 'Rent a car', price: 200}),
    generateOffer({id: 'drive-2', title: 'Add child seat', price: 10})
  ],
  'check-in': [
    generateOffer({id: 'check-in-1', title: 'Add breakfast', price: 50}),
    generateOffer({id: 'check-in-2', title: 'Room upgrade', price: 100})
  ],
  sightseeing: [
    generateOffer({id: 'sightseeing-1', title: 'Book tickets', price: 40}),
    generateOffer({id: 'sightseeing-2', title: 'Lunch in city', price: 30})
  ]
};

const POINT_LIST = [
  generatePoint({
    id: 'point-1',
    type: 'taxi',
    destination: 'amsterdam',
    basePrice: 20,
    dateFrom: '2019-03-18T10:30:00.000Z',
    dateTo: '2019-03-18T11:00:00.000Z',
    isFavorite: true,
    offers: ['taxi-1']
  }),
  generatePoint({
    id: 'point-2',
    type: 'flight',
    destination: 'chamonix',
    basePrice: 160,
    dateFrom: '2019-03-18T12:25:00.000Z',
    dateTo: '2019-03-18T13:35:00.000Z',
    isFavorite: false,
    offers: ['flight-1', 'flight-2']
  }),
  generatePoint({
    id: 'point-3',
    type: 'drive',
    destination: 'chamonix',
    basePrice: 160,
    dateFrom: '2019-03-18T14:30:00.000Z',
    dateTo: '2019-03-18T16:05:00.000Z',
    isFavorite: true,
    offers: ['drive-1']
  })
];

export {DESTINATION_LIST, OFFERS_BY_TYPE, POINT_LIST};
