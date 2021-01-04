import React, { useEffect, useState } from 'react';
import usePremierData from '../../usePremierData'; 
/**
 * Renders palyers fixtures
 * @param {Object} props 
 * @param {import('../../../PremierContext/premier').ElementFixtures} props.data - Players fixture data
 */
export default function Fixtures({ data, amount, mini }) {
  const { currentGameweek } = usePremierData();
  // data = { fixtures, history, history_past }
  const [ next, setNext ] = useState([]);
  const [ future, setFuture ] = useState([]);

  useEffect(() => {
    // No league stats on context!
    if (data) {
      /**
       * We want to remove current gameweeks match. It's useless as the player can't be traded anymore.
       * We also want to highlight next gameweeks mathes, using a divider.
       */
      //let upcoming = data.fixtures.filter(f => f.event !== currentGameweek.id);
      setNext(data.fixtures.filter(f => f.event === currentGameweek.id + 1));
      setFuture(data.fixtures.filter(f => f.event !== currentGameweek.id && f.event !== currentGameweek.id + 1));
      //setFixture(upcoming);
    }
  }, [ data, currentGameweek ]);

  return (
    <div className={`player-fixtures${mini ? `-mini`: ''}`}>
      <div className="next-week">
        {next.length ? next.map((match, i) => {
          return <MatchInfo key={i} match={match} mini={mini} />
        }) : <MatchInfo mini={mini} />}
      </div>
      <div className="future-weeks">
        {future.length && future.slice(0, amount ? amount - (next.length > 1 ? next.length : 1) : 3).map((match, i) => {
          return <MatchInfo key={i} match={match} mini={mini} />
        })}
      </div>
    </div>
  )
}

const MatchInfo = ({ match, mini }) => {
  const { getTeamById } = usePremierData();
  const team = match && (match.is_home ? getTeamById(match.team_a) : getTeamById(match.team_h));
  
  return (
    <> 
      { match ? 
      <div className={`fixture-bg${match.difficulty} fixture-span`}>
        <div className={mini && 'fixture-mini-container'}>
          {!mini && <div className="match-location">{match.is_home ? 'H' : 'A'}</div>}
          <div className="opponent-name">{team.short_name}</div>
        </div>
      </div> :
      <div className="fixture-bg3 fixture-span">
        <div className={mini && 'fixture-mini-container'}>
          {!mini && <div className="match-location" style={{color: 'red'}}>?</div>}
          <div className="opponent-name" style={{color: 'red'}}>X</div>
        </div>
      </div>
      }
    </>
  )
}