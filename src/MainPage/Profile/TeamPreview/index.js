import React, { useEffect, useState } from 'react';

import PlayerStats    from './PlayerStats';
import PlayerPreview  from './PlayerPreview';

/**
 * Render users current roster on the pitch.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').EntryObject} props.team - Users Team 
 */
export default function TeamInfo({ team, context }) {

  const [ player, setPlayer ] = useState(null);
  const [ picks, setPicks] = useState(null);

  const [ modalShow, setModalShow ] = useState(false);
  const [ playerInfo, setPlayerInfo ] = useState(null);

  useEffect(() => {
    // No league stats on context!
    if (team.id) {
      const fetchData = async (id) => {
        let [player_res, picks_res] = [await context.GetPlayerInfo(id), await context.GetPicks(id, team.current_event)];
        setPicks(picks_res);
        setPlayer(player_res);
      }
      fetchData(team.id);
    }
  }, [ team ]);

  const checkPlayer = (info) => {
    console.log('Player', info);
    setPlayerInfo(info);
    setModalShow(true);
  }
  /** 
  <div className="team-preview">
   <div className="team-container">
    <div>
     <ul className="Tabs_list">This contains switch to view list or pitch</ul>
     <div>
      <div className="pitch-container">
       <div className="pitch">
        <div className="pitch-row">
         <div className="pitch-unit">
          <div className="pitch-element">
           <div className="pitch-element-styled">
            <button className="pitch-shirt-button">
             <picture>
              <source></source>
              <img className="pitch-shirt-image"></img>
             </picture>
             <div>
              <div className="element-player-name"></div>
              <div className="element-player-value"></div>
             </div>
            </button>
           </div>
          </div>
         </div>
        </div>
       </div>
       <div className="bench">
       </bench>
      </div>
     </div>
    </div>
   </div>
  </div>
  */
  return (
    <div className="team-preview">
      <PlayerStats show={modalShow} onHide={() => setModalShow(false)} info={playerInfo} context={context} />
      <div className="team-container">
        <div>
          <div className="team-name">
            <b>{team.name}</b>
          </div>
          <div>
            <div className="pitch-container">
              <div className="pitch">
                { player && picks ? <>
                  <PitchRow arr={picks.picks} type={1} context={context} check={checkPlayer} />
                  <PitchRow arr={picks.picks} type={2} context={context} check={checkPlayer} />
                  <PitchRow arr={picks.picks} type={3} context={context} check={checkPlayer} />
                  <PitchRow arr={picks.picks} type={4} context={context} check={checkPlayer} />
                </> : null}
              </div>
              <div className="bench">
                { player && picks ? <>
                  <PitchRow arr={picks.picks} type={0} context={context} check={checkPlayer} />
                </>: null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PitchRow = ({ arr, type, context, check }) => {

  const config = [
    { name: 'bench-row', }, 
    { name: 'goalkeepers', code: 1, count: 4 }, 
    { name: 'defenders', code: 2, count: 5 },
    { name: 'midfield', code: 3, count: 5},
    { name: 'forwards', code: 4, count: 3}
  ];

  const player_row = arr.reduce((result, i) => {
    let p = getPlayer(i.element, context);
    // Get bench players
    if (type === 0 && i.multiplier <= 0) {
      result.push({
        player: p,
        info: i
      });
    }
    // Check player type, select only player that are given type.
    else if (p.element_type === type && i.multiplier > 0) {
      result.push({
        player: p,
        info: i
      });
    }
    return result;
  }, []);

  // Prevent shirts stacking on one side.
  if (player_row.length <= 2) {
    player_row.unshift({ info: null, player: null });
    player_row.unshift({ info: null, player: null });
    player_row.push({ info: null, player: null });
    player_row.push({ info: null, player: null });
  }

  return (
    <div className={`pitch-row ${config[type].name}`}>
      {player_row.map((p, i) => {
        return (p.info ? <PlayerPreview key={i} data={p} context={context} onCheck={check}/> : <div key={i} className="pitch-unit" />)
      })}
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

/**
 * Gets player information from our context.
 * @param {Number} id PlayerId 
 * @returns {import('../../../PremierContext/premier').Element} PlayerInfo 
 */
const getPlayer = (id, context) => {
  return context.elements.find(e => e.id === id);
}

const getPlayerType = (id, context) => {
  console.log(id);
  return context.season.element_types.find(e => e.id === id).plural_name_short;
}