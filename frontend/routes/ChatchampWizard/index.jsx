import React from 'react';
import { Route } from '@shopgate/engage/components';
import { WIZARD_ROUTE_PATTERN } from '../../constants';
import Wizard from '../../components/Wizard';

export default () => (
  <Route
    pattern={WIZARD_ROUTE_PATTERN}
    component={Wizard}
    // Takes care that the route is not removed from stack when navigating to PDP
    cache
  />
);
