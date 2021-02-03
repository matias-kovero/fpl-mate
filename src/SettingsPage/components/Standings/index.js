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
      <Accordion.Toggle as={Card.Header} eventKey={eventKey} style={{ textAlign: 'left'}}>
        Standings
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <div className="cache-option">Standings</div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}