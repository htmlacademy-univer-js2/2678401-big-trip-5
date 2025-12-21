import {FILTERS} from '/src/util/data.js';

export function generateFilters(points) {
  return Object.entries(FILTERS).map(([filterType, filterPoints]) => ({
    type: filterType,
    count: filterPoints(points).length
  }));
}
