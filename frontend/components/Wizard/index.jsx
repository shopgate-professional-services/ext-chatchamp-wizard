import React, {
  useRef, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import classNames from 'classnames';
import { useTheme, useRoute, logger } from '@shopgate/engage/core';
import { getProductFetching } from '../../selectors';
import { customerId, iFrameURL, pageTitleMapping } from '../../config';

const styles = {
  iframe: css({
    display: 'block',
    border: 'none',
  }),
  iframeWrapper: css({
    overflow: 'hidden',
    display: 'flex',
    flex: 1,
  }),
};

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  productFetching: getProductFetching(state),
});

/**
 * The ChatchampWizard component which renders the route content with navigation bar and iFrame
 * for the actual Chatchamp wizard.
 * @returns {JSX}
 */
const ChatchampWizard = ({ productFetching }) => {
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

      // Handle messages dispatched when PDP button was pressed inside the wizard
      if (message?.type === 'window-open' && message?.url && !productFetching) {
        window.open(message.url);
      }
    } catch (e) {
      logger.error('Chatchamp Extension: Failed to process iFrame message', e);
    }
  }, [productFetching]);

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

  return (
    <View>
      <AppBar title={pageTitle} />
      <div className={classNames(styles.iframeWrapper, 'chatchamp-iframe-wrapper')}>
        <iframe
          ref={iframeRef}
          src={`${iFrameURL}?customerId=${customerId}&wizardId=${wizardId}`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className={classNames(styles.iframe, 'chatchamp-iframe')}
          title="chatchamp-iframe"
        />
      </div>
    </View>
  );
};

ChatchampWizard.propTypes = {
  productFetching: PropTypes.bool.isRequired,
};

export default connect(makeMapStateToProps)(ChatchampWizard);
