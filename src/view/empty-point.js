import AbstractView from '../framework/view/abstract-view.js';

function createEmptyPointViewTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class EmptyPointView extends AbstractView {
  get template() {
    return createEmptyPointViewTemplate();
  }
}
