import {render, remove} from '../framework/render.js';
import {sortByDay, sortByPrice, sortByDuration} from '../util/utils.js';
import {SORT_TYPE_LIST, UPDATE_TYPE_LIST, USER_ACTION, FILTER_LIST, FILTER_TYPE_LIST} from '../util/data.js';
import SortPointView from '../view/sort.js';
import ListPointView from '../view/list-point.js';
import EmptyPointView from '../view/empty-point.js';
import PointModel from '../domain/model/point.js';
import OfferModel from '../domain/model/offer.js';
import DestinationModel from '../domain/model/destination.js';
import FiltersModel from '../domain/model/filters.js';
import PointPresenter from '../presenter/point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewTaskPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #pointList = null;
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;
  #filterModel = null;
  #filterType = null;
  #tripEvents = null;
  #sortComponent = null;
  #filterComponent = null;
  #currentSortType = SORT_TYPE_LIST[0];

  #pointInitialList = [];
  #points = [];
  #filteredPoints = [];
  #offers = [];
  #destinations = [];

  #pointPresenterList = new Map();

  constructor() {
    this.#tripEvents = document.querySelector('.trip-events');
    this.#pointList = new ListPointView();
    this.#pointModel = new PointModel();
    this.#offerModel = new OfferModel();
    this.#destinationModel = new DestinationModel();
    this.#filterModel = new FiltersModel();

    this.#pointModel.addObserver(this.#handleModelEventChange);
    this.#filterModel.addObserver(this.#handleModelEventChange);
  }

  init() {
    this.#pointInitialList = [...this.#pointModel.getPoints()];
    this.#offers = [...this.#offerModel.getOffers()];
    this.#destinations = [...this.#destinationModel.getDestinations()];

    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SORT_TYPE_LIST[0];
    this.#filterModel.setFilter(UPDATE_TYPE_LIST.MAJOR, FILTER_TYPE_LIST.EVERYTHING);
    this.#renderNewPoint();
  }

  #renderNewPoint() {
    const newTaskComponent = new NewTaskPresenter(
      this.#destinations,
      this.#offers,
      this.#pointList.element,
      this.#handlePointDataChange
    );

    newTaskComponent.init();
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

  #renderFilterComponent() {
    this.#filterComponent = new FilterPresenter({
      filterModel: this.#filterModel,
      pointModel: this.#pointModel
    });

    this.#filterComponent.init();
  }

  #renderBoard() {
    if (this.#pointInitialList.length > 0) {
      this.#renderFilterComponent();

      this.#sortComponent = new SortPointView({
        sortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange
      });
      this.#sortWaypoints();
      render(this.#sortComponent, this.#tripEvents);
      render(this.#pointList, this.#tripEvents);

      for (let i = 0; i < this.#filteredPoints.length; i++) {
        this.#renderPointTask(this.#filteredPoints[i], this.#offers[i],
          this.#destinations[i]);
      }
    } else {
      render(new EmptyPointView(), this.#tripEvents);
    }
  }

  #sortWaypoints() {
    this.#filterType = this.#filterModel.filter;
    this.#points = [...this.#pointModel.getPoints()];

    this.#filteredPoints = FILTER_LIST[this.#filterType](this.#points);

    switch (this.#currentSortType) {
      case SORT_TYPE_LIST[0]:
        this.#filteredPoints.sort(sortByDay);
        break;
      case SORT_TYPE_LIST[2]:
        this.#filteredPoints.sort(sortByDuration);
        break;
      case SORT_TYPE_LIST[3]:
        this.#filteredPoints.sort(sortByPrice);
        break;
      default:
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortWaypoints();
    this.#currentSortType = sortType;
    this.#clearListView();
    this.#renderBoard();
  };

  #clearListView() {
    this.#pointPresenterList.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
    this.#pointPresenterList.clear();
    remove(this.#sortComponent);
    remove(this.#pointList);
    this.#filterComponent.destroy();
  }

  #handleModeChange = () => {
    this.#pointPresenterList.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handlePointDataChange = (actionType, updateType, updatedPoint) => {
    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, updatedPoint);
        break;
      case USER_ACTION.ADD_POINT:
        this.#pointModel.addPoint(updateType, updatedPoint);
        break;
      case USER_ACTION.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, updatedPoint);
        break;
    }
  };

  #handleModelEventChange = (updateType, updatedPoint) => {
    switch (updateType) {
      case UPDATE_TYPE_LIST.PATCH:
        this.#pointPresenterList.get(updatedPoint.id).init(updatedPoint);
        break;
      case UPDATE_TYPE_LIST.MINOR:
        this.#clearListView();
        this.init();
        break;
      case UPDATE_TYPE_LIST.MAJOR:
        this.#currentSortType = SORT_TYPE_LIST[0];
        this.#sortWaypoints();
        this.#clearListView();
        this.init();
        break;
    }
  };
}
