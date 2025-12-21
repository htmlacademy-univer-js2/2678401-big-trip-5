import {offerList} from './mock/mock-offer.js';

export default class OfferModel {
  constructor() {
    this.offers = [...offerList];
  }

  getOffers() {
    return this.offers;
  }
}
