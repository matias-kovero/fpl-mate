import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').EntryObject} props.team - Users Team 
 */
export default function TeamInfo({ team, context }) {
  //const [ playerIn, setIn ] = useState(getPlayer(subtitute.element_in, context));
  const [ overall, setOverall ] = useState(getOverallStats(team.leagues));

  const [ league, setLeague ] = useState({ standings: { results: [] } });
  const [ modalShow, setModalShow ] = useState(false);
  const [ player, setPlayer ] = useState(null);

  /*
  useEffect(() => {
    // No league stats on context!
    const fetchData = async (id) => {
      setOverall(getOverallStats(team));
    }
    fetchData();
  }, [ team ]);*/

  useEffect(() => {
    // No league stats on context!
  }, [  ]);

  return (
    <div className="flex-container pb-4">
      <div className="default-container">
        <div>
          <h3>{team.player_first_name} {team.player_last_name} <small>({team.player_region_iso_code_long})</small></h3>
          <p>{team.name} &#183; ({team.summary_overall_points}p)</p>
          <h5><small>Overall Live Rank: <b>{team.summary_overall_rank.toLocaleString('fin')}</b> {positionChange(overall)}</small></h5>
        </div>
        <div className="team-shirt">
          <img src={`https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${getTeamCode(team.favourite_team, context)}-220.png`}></img>
        </div>
      </div>
      <div className="default-container">
        <div>
          <h5>{getCurrentGameweek(team.current_event, context)}</h5>
          <b>Last deadline:</b>
          <p><small>Value: {team.last_deadline_value/10}m £</small></p>
          <p><small>Bank: {team.last_deadline_bank/10}m £</small></p>
        </div>
      </div>
    </div>
  )
}

const getCurrentGameweek = (id, context) => {
  return context.season.events.find(t => t.id === id).name;
}

/**
 * Gets player information from our context.
 * @param {Number} id PlayerId 
 * @returns {import('../../../../PremierContext/premier').Element} PlayerInfo 
 */
const getTeamCode = (id, context) => {
  return context.season.teams.find(e => e.id === id).code;
}
/**
 * 
 * @param {import('../../../PremierContext/premier').LeagueObject} leagues 
 */
const getOverallStats = (leagues) => {
  return leagues.classic.find(league => league.name === "Overall");
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