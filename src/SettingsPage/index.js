import React from 'react';
import { Accordion } from 'react-bootstrap';

import Cache from './components/Cache';
import League from './components/Leagues';
import Standings from './components/Standings';

export default function SettingsPage({}) {

  return (
    <div className="layout-wrapper">
      <div className="settings-main">
        <Accordion defaultActiveKey="" className="settings-buttons">
          <Cache eventKey={1} />
          {/*<League eventKey={2} />
          <Standings eventKey={3} /> */}
        </Accordion>
      </div>
    </div>
  )
}