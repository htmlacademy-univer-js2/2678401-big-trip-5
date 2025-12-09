import BoardPresenter from './presenter/board-presenter';

const presenter = new BoardPresenter();

document.addEventListener('DOMContentLoaded', () => {
  presenter.init();
});
