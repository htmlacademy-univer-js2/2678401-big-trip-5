import Observable from '/src/framework/observable.js';
import {FILTER_TYPE_LIST} from '/src/util/data.js';

export default class FiltersModel extends Observable {
  #filter = FILTER_TYPE_LIST.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;

    this._notify(updateType, filter);
  }
}
