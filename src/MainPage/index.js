import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import { Nav } from 'react-bootstrap';

import Gameweek     from './Season/Gameweek';
import ProfilePage  from './Profile';


/**
 * 
 * @param {Object} props
 * @param {import('../PremierContext/premier').EntryObject } props.team Users Team 
 */
export default function MainPage({ team, season, context }) {
  
  return (
    <Container fluid style={{padding: '0'}}>
      <Tab.Container id="main-content-tabs" defaultActiveKey="Season">
      <div className="App-Header">
        <Container>
        <h1 style={{ padding: '1.5rem 0px', fontSize: '5rem', fontWeight: 'bold'}}>Fantasy</h1>
          <Nav className="nav-tabs">
            <Nav.Item>
              <Nav.Link eventKey="Season">Season</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Profile">Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Fixtures">Fixtures</Nav.Link>
            </Nav.Item>
          </Nav>
          </Container>
      </div>
      <Tab.Content style={{ maxWidth: '1000px', margin: 'auto'}}>
        <Tab.Pane eventKey="Season">
          <Container className="pt-4">
            <Row>
              {season.teams ? 
              <Col>
                <Gameweek gameweeks={season.events} context={context} />
              </Col> : null}
            </Row>
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="Profile">
          <ProfilePage user={team} context={context} />
        </Tab.Pane>
        <Tab.Pane eventKey="Fixtures">
          <Container className="pt-4">
            <Row>
              Select Gameweek: 
            </Row>
            <Row>
              GameweekInfo
            </Row>
          </Container>
        </Tab.Pane>
      </Tab.Content>
      </Tab.Container>
    </Container>
  )
}

const positionChange = (league) => {
  let diff = Math.abs(league.entry_rank - league.entry_last_rank).toLocaleString('fin');
  let logo = "";
  if (league.entry_rank < league.entry_last_rank) { // Users ranks has gone down :)
    logo = "↑";
  }
  else if (league.entry_rank > league.entry_last_rank) { // User rank has gone up. -> 
    logo =  "↓";
  } else logo = "-"; // No change on user ranking!

  return `${logo} ${diff}`;
}