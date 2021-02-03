import React from 'react';
import { Button, Accordion, Card } from 'react-bootstrap';
import PremierContext from '../../../PremierContext';

export default function LeagueOptions({ eventKey }) {
  const { recentSearches, defaultUser, defaultPage, clearCache } = React.useContext(PremierContext);


  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={eventKey} style={{ textAlign: 'left'}}>
        League
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <div className="cache-option">Options</div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}