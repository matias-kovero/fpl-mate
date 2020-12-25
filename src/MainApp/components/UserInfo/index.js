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

  // Update players favourite teams shirt.
  useEffect(() => {
    if (user) {
      setShirt(getFavouriteShirt(user));
    }
    return () => {
      setShirt(null);
    }
  }, [ user ]);

  return (
    <div className="user-info-wrapper">
      <div className="default-container">
        <div>
          <h3>{user.player_first_name} {user.player_last_name} <small>({user.player_region_iso_code_long})</small></h3>
          <p>{user.name} &#183; ({user.summary_overall_points}p)</p>
          <h5><small>Overall Live Rank: <b>{user.summary_overall_rank.toLocaleString('fin')}</b> {overallPosChange(user.leagues)}</small></h5>
        </div>
        <div className="team-shirt">
          <img src={shirt}></img>
        </div>
      </div>
      <div className="default-container">
        <h5>{currentGameweek.name}</h5>
        <div>
          <small>Value: £{user.last_deadline_value/10}m</small>
        </div>
        <div>
          <small>Bank: £{user.last_deadline_bank/10}m</small>
        </div>
      </div>
    </div>
  )
}

const currentGameweek = (id, context) => {
  return context.season.events.find(t => t.id === id).name;
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