import { createSelector } from 'reselect';

const statePrefix = '@shopgate-project/chatchamp-wizard/reducer';

/**
 * Selector to retrieve the state of the extension reducer
 * @param {Object} state The application state.
 * @returns {Object}
 */
const getExtensionsState = state => state.extensions[statePrefix];

/**
 * Selector to determine if the extension subscription is currently fetching
 * @returns {Function}
 */
export const getProductFetching = createSelector(
  getExtensionsState,
  extensionState => extensionState.fetching
);
