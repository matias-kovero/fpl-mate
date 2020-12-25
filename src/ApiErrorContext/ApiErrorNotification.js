import React, { useEffect } from 'react';
import useAPIError from './useAPIError';
import { Toast } from 'react-bootstrap';

function APIErrorNotification() {
  const { error, removeError } = useAPIError();

  const handleSubmit = () => {
    removeError();
  };

  return (
    <div style={{position: 'absolute', top: '0', right: '1rem', paddingTop: '1rem' }}>
      <div style={{ position: 'sticky', top: '1rem', right: '1rem', zIndex: '1030'}}>
        <Toast onClose={handleSubmit} show={!!error} delay={5000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          {error && error.message && <Toast.Body>{error.message}</Toast.Body>}
        </Toast>
      </div>
    </div>
  )
}
export default APIErrorNotification;