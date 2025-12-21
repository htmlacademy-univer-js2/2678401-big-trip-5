import {FILTER_LIST} from '/src/util/data.js';

export function generateFilters(points) {
  return Object.entries(FILTER_LIST).map(([filterType, filterPoints]) => ({
    type: filterType,
    count: filterPoints(points).length
  }));
}
