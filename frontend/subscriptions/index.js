import { appDidStart$, redirects, logger } from '@shopgate/engage/core';
import { fetchSearchResults } from '@shopgate/engage/search';
import { getProductRoute } from '@shopgate/engage/product';
import { setChatchampProductFetching } from '../actions';

import { productPagePattern, productURLSearchParam } from '../config';

export default (subscribe) => {
  subscribe(appDidStart$, ({ dispatch }) => {
    /**
     * Handler productPagePattern redirects
     * @param {Object} params Handler params
     */
    const redirectHandler = async ({ action }) => {
      const {
        redirectMeta: { pathParams = {}, matcher } = {},
        params: { pathname } = {},
      } = action ?? {};

      const searchPhrase = pathParams[productURLSearchParam];

      if (!searchPhrase) {
        logger.error('Chatchamp Extension: productSearchParam not found in url', {
          pathname,
          productURLSearchParam,
          matcher,
        });
        return null;
      }

      dispatch(setChatchampProductFetching(true));

      const searchResults = await dispatch(fetchSearchResults({
        searchPhrase,
        limit: 1,
        resolveCachedProducts: true,
      }));

      dispatch(setChatchampProductFetching(false));

      const product = searchResults?.products[0];

      if (product?.id) {
        return getProductRoute(product.id);
      }

      return null;
    };

    redirects.set(productPagePattern, redirectHandler);
  });
};
