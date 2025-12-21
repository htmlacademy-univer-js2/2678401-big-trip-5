import BoardPresenter from './presenter/board-presenter.js';

const newPointButton = document.querySelector('.trip-main__event-add-btn');
const boardPresenter = new BoardPresenter();

const handleNewPointClick = (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
  newPointButton.disabled = true;
};

newPointButton.addEventListener('click', handleNewPointClick);

document.addEventListener('DOMContentLoaded', () => {
  boardPresenter.init();
});
