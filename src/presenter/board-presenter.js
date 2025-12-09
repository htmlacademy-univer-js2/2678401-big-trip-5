import {render, RenderPosition} from '../framework/render';
import FiltersView from '../view/filters.js';
import SortView, {SortType} from '../view/sort.js';
import CreatePointView from '../view/create-point.js';
import EmptyPointView from '../view/empty-point.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  constructor(model) {
    this.model = model;
    this.pointPresenters = [];
    this.currentSortType = SortType.DAY;
  }

  init() {
    this.renderFilters();
    this.renderSort();

    const pointList = this.model.getPoints();
    if (pointList.length === 0) {
      this.renderEmpty();
      return;
    }

    this.renderPoints();
    this.renderCreateForm();
  }

  renderFilters() {
    const tripControlsFilters = document.querySelector('.trip-controls__filters');

    const pointList = this.model.getPoints();
    const now = new Date();
    const hasFuture = pointList.some((p) => new Date(p.dateFrom) > now);
    const hasPresent = pointList.some((p) => new Date(p.dateFrom) <= now && now <= new Date(p.dateTo));
    const hasPast = pointList.some((p) => new Date(p.dateTo) < now);

    const filtersView = new FiltersView({hasFuture, hasPresent, hasPast});
    render(filtersView, tripControlsFilters, RenderPosition.BEFOREEND);
  }

  renderSort() {
    const tripEvents = document.querySelector('.trip-events');
    const h2 = tripEvents.querySelector('h2');
    this.sortView = new SortView(this.currentSortType);
    this.sortView.setSortTypeChangeHandler((sortType) => this.handleSortTypeChange(sortType));
    render(this.sortView, h2, RenderPosition.AFTEREND);
  }

  renderPoints() {
    const tripEventsList = document.querySelector('.trip-events__list');
    const pointsToRender = this.getSortedPoints();


    this.pointPresenters = pointsToRender.map((point) => {
      const destination = this.model.getDestinationById(point.destination);
      const selectedOfferList = this.model.getSelectedOffers(point);

      const listItem = document.createElement('li');
      listItem.className = 'trip-events__item';
      tripEventsList.appendChild(listItem);

      const presenter = new PointPresenter({
        container: listItem,
        point,
        destination,
        selectedOfferList,
        offersByType: this.model.getOffersByType(point.type),
        allDestinations: this.model.getAllDestinations(),
        onModeChange: () => this.resetAllPointViews(),
        onDataChange: (updatedPoint) => this.updatePoint(updatedPoint)
      });
      presenter.init();
      return presenter;
    });
  }

  resetAllPointViews() {
    this.pointPresenters.forEach((p) => p.resetView());
  }

  updatePoint(updatedPoint) {
    this.model.updatePoint(updatedPoint);
    const presenter = this.pointPresenters.find((p) => p.point.id === updatedPoint.id);

    if (!presenter) {
      return;
    }

    presenter.point = updatedPoint;
    presenter.selectedOffers = this.model.getSelectedOffers(updatedPoint);
    presenter.offersByType = this.model.getOffersByType(updatedPoint.type);
    presenter.resetView();

    presenter.init();
  }

  handleSortTypeChange(sortType) {
    if (this.currentSortType === sortType) {
      return;
    }
    this.currentSortType = sortType;
    this.clearPoints();
    this.renderPoints();
  }

  getSortedPoints() {
    const points = this.model.getPoints().slice(0, 3);

    if (this.currentSortType === SortType.TIME) {
      return points.sort((a, b) => (new Date(b.dateTo) - new Date(b.dateFrom)) - (new Date(a.dateTo) - new Date(a.dateFrom)));
    }

    if (this.currentSortType === SortType.PRICE) {
      return points.sort((a, b) => b.basePrice - a.basePrice);
    }

    return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }

  clearPoints() {
    this.pointPresenters.forEach((p) => p.destroy());
    this.pointPresenters = [];
    const eventsList = document.querySelector('.trip-events__list');
    if (eventsList) {
      eventsList.innerHTML = '';
    }
  }

  renderCreateForm() {
    const eventsList = document.querySelector('.trip-events__list');
    const defaultOfferList = this.model.getOffersByType('flight');
    const allDestinationList = this.model.getAllDestinations();
    const createPointView = new CreatePointView(defaultOfferList, allDestinationList);
    const listItem = document.createElement('li');
    listItem.className = 'trip-events__item';
    listItem.appendChild(createPointView.getElement());
    eventsList.appendChild(listItem);
  }

  renderEmpty() {
    const tripEvents = document.querySelector('.trip-events');
    const h2 = tripEvents.querySelector('h2');
    const emptyView = new EmptyPointView();
    render(emptyView, h2, RenderPosition.AFTEREND);
  }
}
