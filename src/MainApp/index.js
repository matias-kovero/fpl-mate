import React from 'react';
import { Tab, Nav, Spinner } from 'react-bootstrap';

import Profile from './Profile';
import Fixtures from './Fixtures';

/**
 * 
 * @param {Object} props
 * @param {import('../PremierContext/premier').EntryObject } props.team Users Team 
 */
export default function MainApp({ team, season, context, searchProfile }) {
  
  return (
    <Tab.Container id="main-content-tabs" defaultActiveKey="Profile">
      <div className="app-header-container">
        <div className="layout-wrapper">
          <div className="styled-player-component">
            <div className="app-header">
              <h1 className="app-game-title">Fantasy</h1>
              <Nav className="nav-tabs">
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
          
        </Tab.Pane>
      </Tab.Content> 
      : <LoadingScreen /> }
    </Tab.Container>
  )
}

const LoadingScreen = ({}) => {

  return (
    <div className="loading-wrapper">
      <div className="loading-container">
        <Spinner animation="grow" style={{ backgroundColor: '#02894e'}} />
      </div>
    </div>
  )
}