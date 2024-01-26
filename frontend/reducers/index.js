import { CHATCHAMP_PRODUCT_FETCHING } from '../constants';

const defaultState = {
  fetching: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case CHATCHAMP_PRODUCT_FETCHING:
      return {
        ...state,
        fetching: action.fetching,
      };
    default:
      return state;
  }
};
