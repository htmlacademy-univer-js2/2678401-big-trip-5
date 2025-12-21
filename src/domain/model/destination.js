import {destinationList} from './mock/mock-destination.js';

export default class DestinationModel {
  constructor() {
    this.destinations = [...destinationList];
  }

  getDestinations() {
    return this.destinations;
  }
}
