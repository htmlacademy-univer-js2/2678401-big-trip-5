import EditPointView from './edit-point.js';

export default class CreatePointView extends EditPointView {
  constructor(availableOfferList = [], allDestinationList = []) {
    super(null, null, availableOfferList, [], allDestinationList);
  }
}
