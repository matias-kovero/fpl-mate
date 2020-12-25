import React, { useEffect, useState } from 'react';
import usePremierData from '../../usePremierData'; 
/**
 * Renders palyers fixtures
 * @param {Object} props 
 * @param {import('../../../PremierContext/premier').ElementFixtures} props.data - Players fixture data
 */
export default function Fixtures({ data, amount, mini }) {
  const { getTeamById } = usePremierData();
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
        let team = fix.is_home ? getTeamById(fix.team_a) : getTeamById(fix.team_h);
        return ( 
          <div key={i} className={`fixture-bg${fix.difficulty} fixture-span`}>
            { mini ? 
            <div className="fixture-mini-container">
              <div className="opponent-name">{team.short_name}</div>
            </div> :
            <>
              <div className="match-location">{fix.is_home ? 'H' : 'A'}</div>
              <div className="opponent-name">{team.short_name}</div>
            </>}
          </div>
        )
      })}
    </div>
  )
}