import {render, remove} from '../framework/render.js';
import {generateFilters} from '../domain/model/mock/mock-filter.js';
import {updatePointData, sortByDay, sortByPrice, sortByDuration} from '../util/utils.js';
import {SORT_TYPE_LIST} from '../util/data.js';
import Filters from '../view/filters.js';
import SortPointView from '../view/sort.js';
import ListPointView from '../view/list-point.js';
import EmptyPointView from '../view/empty-point.js';
import PointModel from '../domain/model/point.js';
import OfferModel from '../domain/model/offer.js';
import DestinationModel from '../domain/model/destination.js';
import PointPresenter from '../presenter/point-presenter.js';

export default class BoardPresenter {
  #pointList = null;
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;
  #filters = null;
  #tripControlFilters = null;
  #tripEvents = null;
  #sortComponent = null;
  #filterComponent = null;
  #currentSortType = SORT_TYPE_LIST[0];

  #points = [];
  #offers = [];
  #destinations = [];

  #pointPresenterList = new Map();

  constructor() {
    this.#tripControlFilters = document.querySelector('.trip-controls__filters');
    this.#tripEvents = document.querySelector('.trip-events');
    this.#pointList = new ListPointView();
    this.#pointModel = new PointModel();
    this.#offerModel = new OfferModel();
    this.#destinationModel = new DestinationModel();
  }

  init() {
    this.#points = [...this.#pointModel.getPoints()];
    this.#offers = [...this.#offerModel.getOffers()];
    this.#destinations = [...this.#destinationModel.getDestinations()];
    this.#filters = generateFilters(this.#points);

    this.#renderBoard();
  }

  #renderPointTask(point, offer, destination) {
    const pointPresenter = new PointPresenter(
      offer,
      destination,
      this.#destinations,
      this.#offers,
      this.#pointList.element,
      this.#handleModeChange,
      this.#handlePointDataChange
    );

    pointPresenter.init(point);
    this.#pointPresenterList.set(point.id, pointPresenter);
  }

  #renderBoard() {
    if (this.#points.length > 0) {
      this.#filterComponent = new Filters(this.#filters);
      render(this.#filterComponent, this.#tripControlFilters);

      this.#sortComponent = new SortPointView({
        sortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange
      });
      this.#sortWaypoints();
      render(this.#sortComponent, this.#tripEvents);
      render(this.#pointList, this.#tripEvents);

      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPointTask(this.#points[i], this.#offers[i],
          this.#destinations[i]);
      }
    } else {
      render(new EmptyPointView(), this.#tripEvents);
    }
  }

  #sortWaypoints() {
    switch (this.#currentSortType) {
      case SORT_TYPE_LIST[0]:
        this.#points.sort(sortByDay);
        break;
      case SORT_TYPE_LIST[2]:
        this.#points.sort(sortByDuration);
        break;
      case SORT_TYPE_LIST[3]:
        this.#points.sort(sortByPrice);
        break;
      default:
        break;
    }
  }

  #clearListView() {
    this.#pointPresenterList.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
    this.#pointPresenterList.clear();
    remove(this.#sortComponent);
    remove(this.#pointList);
    remove(this.#filterComponent);
  }

  #handleModeChange = () => {
    this.#pointPresenterList.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handlePointDataChange = (updatedPoint) => {
    this.#points = updatePointData(this.#points, updatedPoint);
    this.#pointPresenterList.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortWaypoints();
    this.#currentSortType = sortType;
    this.#clearListView();
    this.#renderBoard();
  };
}
