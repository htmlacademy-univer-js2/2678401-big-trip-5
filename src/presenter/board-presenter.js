import {render, remove} from '../framework/render.js';
import {generateFilters} from '../domain/model/mock/mock-filter.js';
import {updatePointData, sortByDay, sortByPrice, sortByDuration} from '../util/utils.js';
import {SORT_TYPES} from '../util/data.js';
import Filters from '../view/filters.js';
import Sorting from '../view/sort.js';
import RoutePointList from '../view/list-point.js';
import EmptyPointList from '../view/empty-point.js';
import PointsModel from '../domain/model/point.js';
import OffersModel from '../domain/model/offer.js';
import DestinationsModel from '../domain/model/destination.js';
import TaskPresenter from '../presenter/point-presenter.js';

export default class Presenter {
  #routePointListElement = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filters = null;
  #tripControlFilters = null;
  #tripEvents = null;
  #sortComponent = null;
  #filterComponent = null;
  #currentSortType = SORT_TYPES[0];

  #pointsArray = [];
  #offersArray = [];
  #destinationsArray = [];

  #pointPresenters = new Map();

  constructor() {
    this.#tripControlFilters = document.querySelector('.trip-controls__filters');
    this.#tripEvents = document.querySelector('.trip-events');
    this.#routePointListElement = new RoutePointList();
    this.#pointsModel = new PointsModel();
    this.#offersModel = new OffersModel();
    this.#destinationsModel = new DestinationsModel();
  }

  init() {
    this.#pointsArray = [...this.#pointsModel.getPoints()];
    this.#offersArray = [...this.#offersModel.getOffers()];
    this.#destinationsArray = [...this.#destinationsModel.getDestinations()];
    this.#filters = generateFilters(this.#pointsArray);

    this.#renderBoard();
  }

  #renderPointTask(point, offer, destination) {
    const taskPresenter = new TaskPresenter(
      offer,
      destination,
      this.#destinationsArray,
      this.#offersArray,
      this.#routePointListElement.element,
      this.#handleModeChange,
      this.#handlePointDataChange
    );

    taskPresenter.init(point);
    this.#pointPresenters.set(point.id, taskPresenter);
  }

  #renderBoard() {
    if (this.#pointsArray.length > 0) {
      this.#filterComponent = new Filters(this.#filters);
      render(this.#filterComponent, this.#tripControlFilters);

      this.#sortComponent = new Sorting({
        sortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange
      });
      this.#sortWaypoints();
      render(this.#sortComponent, this.#tripEvents);
      render(this.#routePointListElement, this.#tripEvents);

      for (let i = 0; i < this.#pointsArray.length; i++) {
        this.#renderPointTask(this.#pointsArray[i], this.#offersArray[i],
          this.#destinationsArray[i]);
      }
    } else {
      render(new EmptyPointList(), this.#tripEvents);
    }
  }

  #sortWaypoints() {
    switch (this.#currentSortType) {
      case SORT_TYPES[0]:
        this.#pointsArray.sort(sortByDay);
        break;
      case SORT_TYPES[2]:
        this.#pointsArray.sort(sortByDuration);
        break;
      case SORT_TYPES[3]:
        this.#pointsArray.sort(sortByPrice);
        break;
      default:
        break;
    }
  }

  #clearListView() {
    this.#pointPresenters.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#routePointListElement);
    remove(this.#filterComponent);
  }


  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handlePointDataChange = (updatedPoint) => {
    this.#pointsArray = updatePointData(this.#pointsArray, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
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
