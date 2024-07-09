import { createSelector } from 'reselect';

let getAreComfortCookiesAccepted;

try {
  // Try to import cookie consent related modules. "require()" is used since the currently deployed
  // PWA might not have the required modules implemented yet.

  /* eslint-disable eslint-comments/no-unlimited-disable */
  /* eslint-disable */
  ({ getAreComfortCookiesAccepted } = require('@shopgate/engage/tracking/selectors'));
  /* eslint-enable  */
} catch (e) {
  // Configure fallbacks in case of an import error
  getAreComfortCookiesAccepted = () => true;
}

const statePrefix = '@shopgate-project/chatchamp-wizard/reducer';

/**
 * Selector to retrieve the state of the extension reducer
 * @param {Object} state The application state.
 * @returns {Object}
 */
const getExtensionsState = state => state.extensions[statePrefix];

/**
 * Selector to determine if the extension subscription is currently fetching
 * @returns {boolean}
 */
export const getProductFetching = createSelector(
  getExtensionsState,
  extensionState => extensionState.fetching
);

/**
 * Selector to determine if the Wizard is blocked by a rejected comfort cookie consent.
 * @returns {boolean}
 */
export const getIsBlockedByCookieConsent = createSelector(
  getAreComfortCookiesAccepted,
  isAllowed => !isAllowed
);
