import React, { useState, useEffect, useContext } from 'react';
import usePremierData from '../../usePremierData';
import PremierContext from '../../../PremierContext';

/**
 * Preview users data
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').EntryObject} props.user - Current users data 
 */
export default function UserInfo({ user, points }) {
  const { season: { total_players } } = useContext(PremierContext);
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
          <span>{user.name} &#183; ({user.summary_overall_points}p)</span>
          <div>
            <span>Overall Rank: <b>{user.summary_overall_rank.toLocaleString('fin')}</b> <span className={`rank-change-${rankChange.type}`}>{rankChange.num}</span></span>
          </div>
          <div>
            <span><small>GW Rank: <b>{user.summary_event_rank.toLocaleString('fin')}</b> <small>Top: {Math.round(total_players / user.summary_event_rank)}%</small></small></span>
          </div>
        </div>
        <div className="team-shirt">
          <img src={shirt}></img>
        </div>
      </div>
      <div className="default-container-transparent">
        <div className="gameweek-wrapper">
          <div className="badge-banner">
            <div className="badge-banner-container">
              <div className="badge-banner-body">
                <div><small>Value: £{user.last_deadline_value/10}m</small></div>
                <div><small>Bank: £{user.last_deadline_bank/10}m</small></div>
              </div>
              <div className="badge-banner-title">GW {currentGameweek.id}</div>
            </div>
          </div>
          <div className="badge-banner">
            <div className="badge-banner-container">
              <div className="badge-banner-body">
                <div className="gameweek-user-points">{points}</div>
              </div>
              <div className="badge-banner-title">Points</div>
            </div>
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