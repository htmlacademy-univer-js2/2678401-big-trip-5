import {pointsElementsMock} from './mock/mock-point.js';

export default class PointsModel {
  constructor() {
    this.points = [...pointsElementsMock];
  }

  getPoints() {
    return this.points;
  }
}
