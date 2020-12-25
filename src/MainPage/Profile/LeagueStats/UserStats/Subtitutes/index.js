import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function PlayerStats({ subtitute, context }) {
  const [ playerIn, setIn ] = useState(getPlayer(subtitute.element_in, context));
  const [ playerOut, setOut ] = useState(getPlayer(subtitute.element_out, context));

  useEffect(() => {
    // No league stats on context!
  }, [  ]);

  return (
    <div className="subtitute">
      <Row>
        <Col xs={9}><b>{playerIn.web_name}</b></Col>
        <Col><span style={{color: 'green'}}>↑</span></Col>
      </Row>
      <Row>
        <Col xs={9}><b>{playerOut.web_name}</b></Col>
        <Col><span style={{color: 'red'}}>↓</span></Col>
      </Row>
    </div>
  )
}

const getCurrentGameweek = (id, context) => {
  return context.season.events.find(t => t.id === id).name;
}

/**
 * Gets player information from our context.
 * @param {Number} id PlayerId 
 * @returns {import('../../../../../PremierContext/premier').Element} PlayerInfo 
 */
const getPlayer = (id, context) => {
  return context.elements.find(e => e.id === id);
}