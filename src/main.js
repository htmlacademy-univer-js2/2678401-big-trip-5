import NewTaskButtonView from './view/new-task-button-view';
import FilterView from './view/filter-view';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const boardPresenter = new BoardPresenter({boardContainer: siteMainElement});

render(new NewTaskButtonView(), siteHeaderElement);
render(new FilterView(), siteMainElement);

boardPresenter.init();
