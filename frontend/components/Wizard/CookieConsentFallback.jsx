import React from 'react';
import { css } from 'glamor';
import { Link, I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';

const { colors } = themeConfig;

let PRIVACY_SETTINGS_PATTERN;

try {
  // Try to import cookie consent related modules. "require()" is used since the currently deployed
  // PWA might not have the required modules implemented yet.

  /* eslint-disable eslint-comments/no-unlimited-disable */
  /* eslint-disable */
  ({ PRIVACY_SETTINGS_PATTERN } = require('@shopgate/engage/tracking/constants'));
  /* eslint-enable  */
} catch (e) {
  // nothing to do here
}

const classes = {
  root: css({
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    gap: 16,
    margin: 'auto',
  }),
  link: css({
    width: 'initial',
    color: colors.accent,
    fontWeight: 500,
  }).toString(),
};

/**
 * The CookieConsentFallback component is rendered when the Chatchamp wizard can't be shown
 * due to missing comfort cookies consent.
 * @returns {JSX.Element}
 */
const CookieConsentFallback = () => (
  <div className={classes.root}>
    <I18n.Text string="shopgateProject-chatchampWizard.cookieConsentMessage" />

    {PRIVACY_SETTINGS_PATTERN && (
    <Link href={PRIVACY_SETTINGS_PATTERN} className={classes.link}>
      <I18n.Text string="shopgateProject-chatchampWizard.openPrivacySettings" />
    </Link>
    )}
  </div>
);

export default CookieConsentFallback;
