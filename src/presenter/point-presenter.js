import {render, replace} from '../framework/render.js';
import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  constructor({
                container,
                point,
                destination,
                selectedOffers,
                offersByType,
                allDestinations,
                onModeChange,
                onDataChange
              }) {
    this.container = container;
    this.point = point;
    this.destination = destination;
    this.selectedOffers = selectedOffers;
    this.offersByType = offersByType;
    this.allDestinations = allDestinations;
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

    this.pointView.setRollupHandler(this.#handleOpenEdit);
    this.pointView.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.editPointView.setSubmitHandler(this.#handleFormSubmit);
    this.editPointView.setRollupHandler(this.#handleCloseEdit);

    render(this.pointView, this.container);
  }

  resetView() {
    if (this.mode !== Mode.DEFAULT) {
      this.#replacePoint();
    }
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
