import {pointList} from './mock/mock-point.js';

export default class PointModel {
  constructor() {
    this.points = [...pointList];
  }

  getPoints() {
    return this.points;
  }
}
