import BoardPresenter from './presenter/board-presenter.js';
import BoardModel from './domain/model/board-model.js';

const model = new BoardModel();
const presenter = new BoardPresenter(model);

document.addEventListener('DOMContentLoaded', () => {
  presenter.init();
});
