import React, {
  useRef, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import classNames from 'classnames';
import { useTheme, useRoute, logger } from '@shopgate/engage/core';
import { getProductFetching, getIsBlockedByCookieConsent } from '../../selectors';
import { customerId, iFrameURL, pageTitleMapping } from '../../config';
import CookieConsentFallback from './CookieConsentFallback';

const styles = {
  iframe: css({
    display: 'block',
    border: 'none',
  }),
  iframeWrapper: css({
    overflow: 'hidden',
    display: 'flex',
    flex: 1,
    minHeight: 'calc(100vh - var(--page-content-offset-bottom) - var(--app-bar-height) + var(--extra-ios-scroll-space, 0))',
  }),
};

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  productFetching: getProductFetching(state),
  isBlockedByCookieConsent: getIsBlockedByCookieConsent(state),
});

/**
* Connects the dispatch function to a callable function in the props.
* @param  {Function} dispatch The redux dispatch function.
* @return {Object} The extended component props.
*/
const mapDispatchToProps = dispatch => ({
  showTabBar: () => dispatch({
    type: 'SHOW_TAB_BAR',
  }),
  hideTabBar: () => dispatch({
    type: 'HIDE_TAB_BAR',
  }),
});

/**
 * The ChatchampWizard component which renders the route content with navigation bar and iFrame
 * for the actual Chatchamp wizard.
 * @returns {JSX}
 */
const ChatchampWizard = ({
  productFetching,
  showTabBar,
  hideTabBar,
  isBlockedByCookieConsent,
}) => {
  const { View, AppBar } = useTheme();
  const { params: { wizardId } } = useRoute();

  const iframeRef = useRef();

  /**
   * Handler for messages from the iFrame
   */
  const handleIFrameMessage = useCallback((event) => {
    // Only proceed when the message came from the iFrame
    if (iframeRef.current?.contentWindow !== event.source) {
      return;
    }

    try {
      const message = JSON.parse(event.data);

      switch (message?.type) {
        case 'window-open':
          // Handle messages dispatched when PDP button was pressed inside the wizard
          if (message?.type === 'window-open' && message?.url && !productFetching) {
            window.open(message.url);
          }
          break;
        case 'question-input-focus':
          hideTabBar();
          break;
        case 'question-input-blur':
          showTabBar();
          break;
        default:
          logger.warn('Chatchamp Extension: Unhandled message from iFrame', message);
          break;
      }
    } catch (e) {
      logger.error('Chatchamp Extension: Failed to process iFrame message', e);
    }
  }, [hideTabBar, productFetching, showTabBar]);

  /**
   * Effect to maintain the message event handler for the iFrame
   */
  useEffect(() => {
    window.addEventListener('message', handleIFrameMessage, false);

    return () => {
      window.removeEventListener('message', handleIFrameMessage);
    };
  }, [handleIFrameMessage]);

  /**
   * Determine the page title
   */
  const pageTitle = useMemo(() => {
    const match = (pageTitleMapping ?? []).find(entry => entry?.wizardId === wizardId);

    return match?.title || '';
  }, [wizardId]);

  const iFrameSrc = useMemo(
    () => `${iFrameURL}?customerId=${customerId}&wizardId=${wizardId}`,
    [wizardId]
  );

  return (
    <View noKeyboardListener>
      <AppBar title={pageTitle} />
      { !isBlockedByCookieConsent ? (
        <div className={classNames(styles.iframeWrapper, 'chatchamp-iframe-wrapper')}>
          <iframe
            ref={iframeRef}
            src={iFrameSrc}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className={classNames(styles.iframe, 'chatchamp-iframe')}
            title="chatchamp-iframe"
          />
        </div>
      ) : (
        <CookieConsentFallback />
      )}
    </View>
  );
};

ChatchampWizard.propTypes = {
  hideTabBar: PropTypes.func.isRequired,
  isBlockedByCookieConsent: PropTypes.bool.isRequired,
  productFetching: PropTypes.bool.isRequired,
  showTabBar: PropTypes.func.isRequired,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(ChatchampWizard);
