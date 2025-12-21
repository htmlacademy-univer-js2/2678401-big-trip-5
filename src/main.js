import BoardPresenter from './presenter/board-presenter.js';

const boardPresenter = new BoardPresenter();

document.addEventListener('DOMContentLoaded', () => {
  boardPresenter.init();
});
