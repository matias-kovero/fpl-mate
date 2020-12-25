import React, { useEffect, useState } from 'react';

/**
 * Renders palyers fixtures
 * @param {Object} props 
 * @param {import('../../../../PremierContext/premier').ElementFixtures} props.data - Players fixture data
 */
export default function Fixtures({ data, context, amount, mini }) {
  // data = { fixtures, history, history_past }
  const [ fixtures, setFixture ] = useState([]);

  useEffect(() => {
    // No league stats on context!
    if (data) {
      setFixture(data.fixtures);
    }
  }, [ data ]);

  return (
    <div className={`player-fixtures${mini ? `-mini`: ''}`}>
      {fixtures.slice(0, amount ? amount : 5).map((fix, i) => {
        return ( 
          <div key={i} className={`fixture-bg${fix.difficulty} fixture-span`}>
            { mini ? 
            <div className="fixture-mini-container">
              <div className="opponent-name">{getOpponentName(fix, context)}</div>
            </div> :
            <>
              <div className="match-location">{fix.is_home ? 'H' : 'A'}</div>
              <div className="opponent-name">{getOpponentName(fix, context)}</div>
            </>}
          </div>
        )
      })}
    </div>
  )
}

const getCurrentGameweek = (id, context) => {
  return context.season.events.find(t => t.id === id).name;
}

const getPlayerType = (id, context) => {
  return context.season.element_types.find(e => e.id === id).plural_name_short.charAt(0);
}
const getOpponentName = (fixture, context) => {
  let id = fixture.is_home ? fixture.team_a : fixture.team_h;
  return context.season.teams.find(t => t.id === id).short_name;
}

/**
 * 
 * @param {Number} id - Teams ID 
 * @param {*} context 
 */
const getPlayerTeam = (id, context) => {
  return context.season.teams.find(t => t.id === id).short_name;
}