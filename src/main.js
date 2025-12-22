import BoardPresenter from './presenter/board-presenter.js';
import ApiPointService from './domain/model/api/api-service.js';
import PointModel from './domain/model/point.js';
import {END_POINT, AUTHORIZATION} from './util/data.js';

const newPointButton = document.querySelector('.trip-main__event-add-btn');
const pointModel = new PointModel({apiPointService: new ApiPointService(END_POINT, AUTHORIZATION)});
const boardPresenter = new BoardPresenter({pointModel});

const handleNewPointClick = (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
  newPointButton.disabled = true;
};

newPointButton.addEventListener('click', handleNewPointClick);

document.addEventListener('DOMContentLoaded', () => {
  boardPresenter.startInit();
  pointModel.init()
    .finally();
});
