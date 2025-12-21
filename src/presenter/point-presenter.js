import {remove, render, replace} from '../framework/render.js';
import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  constructor({
                container, point, destination,
                selectedOfferList, offersByType,
                allDestinationList, onModeChange,
                onDataChange
              }) {
    this.container = container;
    this.point = point;
    this.destination = destination;
    this.selectedOffers = selectedOfferList;
    this.offersByType = offersByType;
    this.allDestinations = allDestinationList;
    this.onModeChange = onModeChange;
    this.onDataChange = onDataChange;

    this.mode = Mode.DEFAULT;

    this.pointView = null;
    this.editPointView = null;
  }

  init() {
    this.pointView = new PointView(this.point, this.destination, this.selectedOffers);
    this.editPointView = new EditPointView(
      this.point,
      this.destination,
      this.offersByType,
      this.point.offers || [],
      this.allDestinations
    );

    this.pointView.setRollupClickHandler(this.#handleOpenEdit);
    this.pointView.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.editPointView.setFormSubmitHandler(this.#handleFormSubmit);
    this.editPointView.setRollupClickHandler(this.#handleCloseEdit);

    render(this.pointView, this.container);
  }

  resetView() {
    if (this.mode !== Mode.DEFAULT) {
      this.#replacePoint();
    }
  }

  destroy() {
    if (this.pointView) {
      remove(this.pointView);
    }

    if (this.editPointView) {
      remove(this.editPointView);
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEdit() {
    replace(this.editPointView, this.pointView);
    this.mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replacePoint() {
    replace(this.pointView, this.editPointView);
    this.mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replacePoint();
    }
  };

  #handleOpenEdit = () => {
    this.onModeChange?.();
    this.#replaceEdit();
  };

  #handleCloseEdit = () => {
    this.#replacePoint();
  };

  #handleFormSubmit = () => {
    this.#replacePoint();
  };

  #handleFavoriteClick = () => {
    const updatedPoint = {
      ...this.point,
      isFavorite: !this.point.isFavorite
    };
    this.onDataChange?.(updatedPoint);
  };
}
