import React, { useState, useEffect } from 'react';
import usePremierData from '../../usePremierData';

/**
 * Preview users data
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').EntryObject} props.user - Current users data 
 */
export default function UserInfo({ user }) {
  const { getFavouriteShirt, currentGameweek } = usePremierData();
  const [ shirt, setShirt ] = useState('');
  const [ rankChange, setRank ] = useState({ num: '0', type: 'neutral' });

  // Update players favourite teams shirt.
  useEffect(() => {
    if (user) {
      setShirt(getFavouriteShirt(user));
      setRank(userRankChange(user.leagues));
    }
    return () => {
      setShirt(null);
      setRank(null);
    }
  }, [ user ]);

  return (
    <div className="user-info-wrapper">
      <div className="default-container">
        <div>
          <h3>{user.player_first_name} {user.player_last_name} <small>({user.player_region_iso_code_long})</small></h3>
          <p>{user.name} &#183; ({user.summary_overall_points}p)</p>
          <h5><small>Overall Rank: <b>{user.summary_overall_rank.toLocaleString('fin')}</b> <span className={`rank-change-${rankChange.type}`}>{rankChange.num}</span></small></h5>
        </div>
        <div className="team-shirt">
          <img src={shirt}></img>
        </div>
      </div>
      <div className="default-container">
        <div className="gameweek-wrapper">
          <div className="gameweek-info">
            <div><h5>{currentGameweek.name}</h5></div>
            <div>
              <div><small>Value: £{user.last_deadline_value/10}m</small></div>
              <div><small>Bank: £{user.last_deadline_bank/10}m</small></div>
            </div>
          </div>
          <div className="gameweek-points">
            <div className="gameweek-user-points">{user.summary_event_points}</div>
            <div><b><small>Points</small></b></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const userRankChange = (leagues) => {
  let overall = leagues.classic.find(league => league.name === "Overall");
  let diff = Math.abs(overall.entry_rank - overall.entry_last_rank).toLocaleString('fin'); // Uses space as thousand delimeter
  let logo = '-';
  let type = 'neutral';
  if (overall.entry_rank < overall.entry_last_rank) { logo = '↑';  type = 'positive' }
  else if (overall.entry_rank > overall.entry_last_rank) { logo = '↓'; type = 'negative' }
  return { num: `${logo}${diff}`, type };
}

const overallPosChange = (leagues) => {
  let league = leagues.classic.find(league => league.name === "Overall");
  let diff = Math.abs(league.entry_rank - league.entry_last_rank).toLocaleString('fin');
  let logo = "";
  if (league.entry_rank < league.entry_last_rank) { // Users ranks has gone down :)
    logo = "↑";
  }
  else if (league.entry_rank > league.entry_last_rank) { // User rank has gone up. -> 
    logo =  "↓";
  } else logo = "-"; // No change on user ranking!

  return `${logo}${diff}`;
}