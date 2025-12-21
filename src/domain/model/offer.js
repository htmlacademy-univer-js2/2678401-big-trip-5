import {offersElementsMock} from './mock/mock-offer.js';

export default class OffersModel {
  constructor() {
    this.offers = [...offersElementsMock];
  }

  getOffers() {
    return this.offers;
  }
}
