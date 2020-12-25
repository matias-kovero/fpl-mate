import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';

import TeamInfo from './TeamInfo';
import TeamPreview from './TeamPreview';
import LeagueStats from './LeagueStats';

export default function ProfilePage({ user, context }) {

  return (
    <div>
      <br />
      {user ? 
        <>
          <TeamInfo team={user} context={context} />
          <TeamPreview team={user} context={context} />
          <div>
            <Tabs defaultActiveKey="Overall" id="uncontrolled-tab-example">
                {user.leagues.classic.map((league, i) => {
                  return (
                    <Tab key={i} eventKey={league.name} title={`${league.name} (${league.entry_rank.toLocaleString('fin')})`}>
                      <Container>
                        { league.id ? <LeagueStats league={context.league} context={context} id={league.id} /> : null }
                        Position: {league.entry_rank.toLocaleString('fin')} ({positionChange(league)})
                      </Container>
                    </Tab>
                  )
                })}
              </Tabs>
          </div>
        </> :
        <div>
          <p>No profile found. Please search your profile using search on top-right!</p>
        </div>
      }
    </div>
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