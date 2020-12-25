import React, { useState, useEffect } from 'react';

import PlayerCard from '../PlayerCard';
import PitchShirt from '../PitchShirt';

/**
 * Render users current roster on the pitch.
 * @param {Objetc} props
 * @param {import('../../../PremierContext/premier').EntryObject} props.user - Users data 
 */
export default function PitchView({ user, context }) {
  const [ player, setPlayer ] = useState(null);
  const [ picks, setPicks] = useState(null);
  const [ live, setLive ] = useState(null);

  const [ modal, setModal ] = useState(false);
  const [ info, setInfo ] = useState(null);

  useEffect(() => {
    if (user.id) {
      const fetchData = async (id) => {
        //let [ p, t, l] = [await context.GetPlayerInfo(id), await context.GetPicks(id, user.current_event), await context.GetLiveInfo(user.current_event)];
        let [t, l] = [await context.GetPicks(id, user.current_event), await context.GetLiveInfo(user.current_event)];
        setPlayer(user);
        setPicks(t);
        setLive(l);
      }
      fetchData(user.id);
    }
    // Clean up
    return () => {
      setPlayer(null);
      setPicks(null);
      setLive(null);
    }
  }, [ user ]);

  const showPlayer = (info) => {
    setInfo(info);
    setModal(true);
  }

  return (
    <div className="team-preview">
      { info ? <PlayerCard show={modal} onHide={() => setModal(false)} player={info} /> : null }
      {/*<PlayerStats show={modal} onHide={() => setModal(false)} info={info} context={context} />*/}
      <div className="team-container">
        <div>
          <div className="team-name">
            <b>{user.name}</b>
          </div>
          <div>
            <div className="pitch-container">
              <div className="pitch">
                { player && picks ? <>
                  <PitchRow arr={picks.picks} live={live} type={1} context={context} check={showPlayer} />
                  <PitchRow arr={picks.picks} live={live} type={2} context={context} check={showPlayer} />
                  <PitchRow arr={picks.picks} live={live} type={3} context={context} check={showPlayer} />
                  <PitchRow arr={picks.picks} live={live} type={4} context={context} check={showPlayer} />
                </> : null}
              </div>
              <div className="bench">
                { player && picks ? <>
                  <PitchRow arr={picks.picks} live={live} type={0} context={context} check={showPlayer} />
                </>: null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PitchRow = ({ arr, live, type, context, check }) => {

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
        return (p.info ? <PitchShirt key={i} data={p} live={live} context={context} viewPlayer={check} /> : <div key={i} className="pitch-unit" />)
      })}
    </div>
  )
}

/**
 * Gets player information from our context.
 * @param {Number} id PlayerId 
 * @returns {import('../../../PremierContext/premier').Element} PlayerInfo 
 */
const getPlayer = (id, context) => {
  return context.elements.find(e => e.id === id);
}