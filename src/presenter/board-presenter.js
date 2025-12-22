import {render, remove, RenderPosition} from '../framework/render.js';
import {sortByDay, sortByPrice, sortByDuration} from '../util/utils.js';
import {
  SORT_TYPE_LIST,
  UPDATE_TYPE_LIST,
  USER_ACTION,
  FILTER_LIST,
  FILTER_TYPE_LIST,
  TIME_LIMIT
} from '../util/data.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortPointView from '../view/sort.js';
import ListPointView from '../view/list-point.js';
import EmptyPointView from '../view/empty-point.js';
import LoadingView from '../view/loading.js';
import FiltersModel from '../domain/model/filters.js';
import PointPresenter from '../presenter/point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewTaskPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #pointList = null;
  #pointModel = null;
  #filterModel = null;
  #filterType = null;
  #tripEvents = null;
  #sortComponent = null;
  #filterComponent = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT
  });

  #currentSortType = SORT_TYPE_LIST[0];

  #pointInitialList = [];
  #points = [];
  #filteredPoints = [];
  #offers = [];
  #destinations = [];

  #loadingComponent = new LoadingView();
  #pointPresenterList = new Map();

  constructor({pointModel}) {
    this.#tripEvents = document.querySelector('.trip-events');
    this.#pointList = new ListPointView();
    this.#pointModel = pointModel;
    this.#filterModel = new FiltersModel();

    this.#pointModel.addObserver(this.#handleModelEventChange);
    this.#filterModel.addObserver(this.#handleModelEventChange);
  }

  startInit() {
    this.#renderBoard();
  }

  init() {
    this.#pointInitialList = [...this.#pointModel.getPoints()];
    this.#offers = [...this.#pointModel.getOffers()];
    this.#destinations = [...this.#pointModel.getDestinations()];

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

  #renderPointTask(point) {
    const pointPresenter = new PointPresenter(
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

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEvents, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
        this.#renderPointTask(this.#filteredPoints[i]);
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
    remove(this.#loadingComponent);
    remove(this.#pointList);

    this.#currentSortType = SORT_TYPE_LIST[0];
  }

  #handleModeChange = () => {
    this.#pointPresenterList.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handlePointDataChange = async (actionType, updateType, updatedPoint) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointPresenterList.get(updatedPoint.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, updatedPoint);
        } catch (error) {
          this.#pointPresenterList.get(updatedPoint.id).setAborting();
        }
        break;
      case USER_ACTION.ADD_POINT:
        this.#pointModel.addPoint(updateType, updatedPoint);
        break;
      case USER_ACTION.DELETE_POINT:
        this.#pointPresenterList.get(updatedPoint.id).setDeleting();
        this.#pointPresenterList.get(updatedPoint.id).setSaving();
        try {
          await this.#pointModel.deletePoint(updateType, updatedPoint);
        } catch (err) {
          this.#pointPresenterList.get(updatedPoint.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UPDATE_TYPE_LIST.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
        break;
    }
  };
}
