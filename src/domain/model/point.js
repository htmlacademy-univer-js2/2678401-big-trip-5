import Observable from '/src/framework/observable.js';
import {UPDATE_TYPE_LIST} from '/src/util/data.js';

export default class PointModel extends Observable {
  #points = null;
  #offers = null;
  #destinations = null;
  #apiPointService = null;

  constructor({apiPointService}) {
    super();
    this.#apiPointService = apiPointService;

  }

  async init() {
    try {
      const points = await this.#apiPointService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = await this.#apiPointService.offers;
      this.#destinations = await this.#apiPointService.destinations;
    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }
    this._notify(UPDATE_TYPE_LIST.INIT);
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  getPoints() {
    return this.#points;
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Cant update unexisting Point');
    }

    try {
      const response = await this.#apiPointService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#apiPointService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#points = [
        newPoint,
        ...this.#points,
      ];

      this._notify(updateType, newPoint);
    } catch (error) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Cant update unexisting Point');
    }

    try {
      await this.#apiPointService.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can\'t delete this point');
    }
  }


  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) :
        new Date(point['date_from']),
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) :
        new Date(point['date_to']),
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
