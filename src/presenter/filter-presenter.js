import {render, replace, remove} from '../framework/render.js';
import {FILTER_TYPE_LIST, FILTER_LIST, UPDATE_TYPE_LIST} from '../util/data.js';
import FilterView from '../view/filters.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointModel = null;
  #filterComponent = null;

  #pointList = [];

  constructor({filterModel, pointModel}) {
    this.#filterContainer = document.querySelector('.trip-controls__filters');
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelFilterChange);
    this.#filterModel.addObserver(this.#handleModelFilterChange);
  }

  get filters() {
    this.#pointList = [...this.#pointModel.getPoints()];
    return Object.values(FILTER_TYPE_LIST).map((type) => ({
      type,
      points: FILTER_LIST[type](this.#pointList)
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy() {
    remove(this.#filterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UPDATE_TYPE_LIST.MAJOR, filterType);
  };

  #handleModelFilterChange = () => {
    this.init();
  };
}
