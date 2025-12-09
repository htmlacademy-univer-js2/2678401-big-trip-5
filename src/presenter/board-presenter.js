import {render, RenderPosition, replace} from '../framework/render';
import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import CreatePointView from '../view/create-point.js';

export default class BoardPresenter {
  constructor(model) {
    this.model = model;
  }

  init() {
    this.renderFilters();
    this.renderSort();
    this.renderPoints();
    this.renderCreateForm();
  }

  renderFilters() {
    const tripControlsFilters = document.querySelector('.trip-controls__filters');
    const filtersView = new FiltersView();
    render(filtersView, tripControlsFilters, RenderPosition.BEFOREEND);
  }

  renderSort() {
    const tripEvents = document.querySelector('.trip-events');
    const h2 = tripEvents.querySelector('h2');
    const sortView = new SortView();
    render(sortView, h2, RenderPosition.AFTEREND);
  }

  renderPoints() {
    const tripEventsList = document.querySelector('.trip-events__list');
    const points = this.model.getPoints();

    const pointsToRender = points.slice(0, 3);

    pointsToRender.forEach((point) => {
      const destination = this.model.getDestinationById(point.destination);
      const selectedOfferList = this.model.getSelectedOffers(point);

      const listItem = document.createElement('li');
      listItem.className = 'trip-events__item';
      tripEventsList.appendChild(listItem);

      const pointView = new PointView(point, destination, selectedOfferList);
      listItem.appendChild(pointView.element);

      const availableOffers = this.model.getOffersByType(point.type);
      const selectedOffersIds = point.offers || [];
      const allDestinations = this.model.getAllDestinations();
      const editPointView = new EditPointView(
        point,
        destination,
        availableOffers,
        selectedOffersIds,
        allDestinations
      );

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          replace(pointView, editPointView);
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };

      pointView.setRollupHandler(() => {
        replace(editPointView, pointView);
        document.addEventListener('keydown', onEscKeyDown);
      });

      editPointView.setSubmitHandler(() => {
        replace(pointView, editPointView);
        document.removeEventListener('keydown', onEscKeyDown);
      });

      editPointView.setRollupHandler(() => {
        replace(pointView, editPointView);
        document.removeEventListener('keydown', onEscKeyDown);
      });
    });
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
}
