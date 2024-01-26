import { CHATCHAMP_PRODUCT_FETCHING } from '../constants';

/**
 * Action the set the product fetching state.
 * @param {boolean} [fetching=true] The fetching state
 * @returns {Object}
 */
export const setChatchampProductFetching = (fetching = true) => ({
  type: CHATCHAMP_PRODUCT_FETCHING,
  fetching,
});
