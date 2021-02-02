import React from 'react';
import { Tab, Nav, Spinner } from 'react-bootstrap';

import Profile from './Profile';
import Fixtures from './Fixtures';
import Leagues from './Leagues';

/**
 * 
 * @param {Object} props
 * @param {import('../PremierContext/premier').EntryObject } props.team Users Team 
 */
export default function MainApp({ team, context, searchProfile, activePage }) {
  
  return (
    <Tab.Container id="main-content-tabs" defaultActiveKey={context.defaultPage ? context.defaultPage : "Profile" }>
      <div className="app-header-container">
        <div className="layout-wrapper">
          <div className="styled-player-component">
            <div className="app-header">
              <h1 className="app-game-title">Fantasy</h1>
              <Nav className="nav-tabs" onSelect={(selectedKey) => activePage(selectedKey)}>
                <Nav.Item>
                  <Nav.Link eventKey="Profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Fixtures">Fixtures</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Leagues">Leagues</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </div>
      </div>
      { context.season && context.fixtures ? 
      <Tab.Content>
        <Tab.Pane eventKey="Profile">
          <Profile user={team} searchProfile={searchProfile} />
        </Tab.Pane>
        <Tab.Pane eventKey="Fixtures">
          <Fixtures />
        </Tab.Pane>
        <Tab.Pane eventKey="Leagues">
          <Leagues user={team} />
        </Tab.Pane>
      </Tab.Content> 
      : <LoadingScreen /> }
    </Tab.Container>
  )
}

export const LoadingScreen = ({}) => {

  return (
    <div className="loading-wrapper">
      <div className="loading-container">
        <Spinner animation="grow" style={{ backgroundColor: '#02894e'}} />
      </div>
    </div>
  )
}