import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import ListPointView from '../view/list-point-view.js';
import PointView from '../view/point-view.js';
import PointAddView from '../view/point-add-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render} from '../render.js';

export default class BoardPresenter {

  boardComponent = new BoardView();
  listPointComponent = new ListPointView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.listPointComponent, this.boardComponent.getElement());
    render(new PointEditView(), this.listPointComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listPointComponent.getElement());
    }

    render(new PointAddView(), this.boardComponent.getElement());
  }
}
