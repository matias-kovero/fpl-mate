import React from 'react';
import { Button, Accordion, Card } from 'react-bootstrap';
import PremierContext from '../../../PremierContext';

export default function SettingsPage({ eventKey }) {
  const { recentSearches, defaultUser, defaultPage, clearCache } = React.useContext(PremierContext);

  const clearUserCache = (e) => {
    e.preventDefault();
    clearCache();
  }

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={eventKey} style={{ textAlign: 'left', color: '#484848ad'}}>
        <span style={{ fontWeight: '600' }}>Cache</span>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <div className="cache-option" style={{ textAlign: 'left', fontSize: 'small' }}>
            <div>Local profiles: {recentSearches.length}</div>
            <div>Default team: {!defaultUser || defaultUser == 0 ? 'Not Set' : defaultUser}</div>
            <div>PageAfterRefresh: {defaultPage}</div>
            <br />
            <div className="option-action">
              <Button variant="danger" size="sm" block onClick={clearUserCache}>Clear cache</Button>
            </div>
          </div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}