import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';
import {MODE} from '../util/data.js';

export default class PointPresenter {
  #point = null;
  #offer = null;
  #destination = null;
  #allDestinations = null;
  #allOffers = null;
  #mode = MODE.DEFAULT;

  #pointTask = null;
  #pointEdit = null;
  #pointList = null;

  #handleModeChange = null;
  #handleDataChange = null;

  #escKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEdit.reset();
      this.#replaceEditToTask();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  };

  constructor(offer, destination, allDestinations,
              allOffers, pointList,
              onModeChange, onDataChange) {
    this.#offer = offer;
    this.#destination = destination;
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#pointList = pointList;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;
    this.#offer = this.#allOffers.find((offer) => offer.type === point.type ? offer : null);
    this.#destination = this.#allDestinations.find((destination) => destination.name === point.destination ? destination : null);

    const prevPointComponent = this.#pointTask;
    const prevEditFormComponent = this.#pointEdit;

    this.#pointTask = new PointView({
      point: this.#point,
      offer: this.#offer,
      destination: this.#destination,
      onEditClick: () => {
        this.#replaceTaskToEdit();
        document.addEventListener('keydown', this.#escKeyHandler);
      },
      onFavoriteClick: () => {
        this.#addPointToFavorite();
      }
    });

    this.#pointEdit = new EditPointView({
      point: this.#point,
      offer: this.#offer,
      destination: this.#destination,
      allDestinations: this.#allDestinations,
      allOffers: this.#allOffers,
      onRollupClick: () => {
        this.#pointEdit.reset();
        this.#replaceEditToTask();
        document.removeEventListener('keydown', this.#escKeyHandler);
      },
      onFormSubmit: (newPoint) => {
        this.#handleDataChange({...newPoint});
        this.#replaceEditToTask();
      }
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointTask, this.#pointList);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#pointTask, prevPointComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#pointEdit, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#pointTask);
    remove(this.#pointEdit);
  }

  resetView() {
    if (this.#mode !== MODE.DEFAULT) {
      this.#replaceEditToTask();
    }
  }

  #replaceTaskToEdit() {
    replace(this.#pointEdit, this.#pointTask);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceEditToTask() {
    replace(this.#pointTask, this.#pointEdit);
    this.#mode = MODE.DEFAULT;
  }

  #addPointToFavorite = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
