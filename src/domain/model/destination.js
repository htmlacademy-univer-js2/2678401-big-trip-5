import { destinationsElementsMock } from './mock/mock-destination.js';

export default class DestinationsModel {
  constructor() {
    this.destinations = [...destinationsElementsMock];
  }

  getDestinations() {
    return this.destinations;
  }
}
