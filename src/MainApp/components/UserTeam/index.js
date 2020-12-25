import React, { useEffect, useState } from 'react';
import usePremierData from '../../usePremierData';
import PlayerCard from '../PlayerCard';
import Fixtures   from '../PlayerFixtures';

/**
 * List users current team.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').EntryObject} props.team - Users data
 */
export default function UserTeam({ team }) {
  const { useGetPick, useLiveData } = usePremierData();
  const { data: pickData, loading: pickLoading } = useGetPick(team.id, team.current_event);
  const { data: liveData, loading: liveLoading } = useLiveData(team.current_event);
  const [ roster, setRoster ] = useState([]);
  const [ live, setLive ] = useState(null);

  const [ modal, setModal ] = useState(false);
  const [ info, setInfo ] = useState(null);

  // Fetch team information
  useEffect(() => {
    if (pickData) {
      setRoster(pickData.picks);
    }
    // Clean-up
    return () => {
      setRoster([]);
    }
  }, [ pickData ]);

  // Fetch live data
  useEffect(() => {
    if (liveData) {
      setLive(liveData);
    }
    // Clean-up
    return () => {
      setLive(null);
    }
  }, [ liveData ]);

  const showPlayer = (info) => {
    setInfo(info);
    setModal(true);
  }

  // If no data, prevent render.
  if ( !roster || !live ) return null;

  return (
    <div className="roster-wrapper">
      { info ? <PlayerCard show={modal} onHide={() => setModal(false)} player={info} /> : null }
      <div className="players-container">
        <div>
          <RosterTable arr={roster} type={1} live={live} showPlayer={showPlayer} />
          <RosterTable arr={roster} type={2} live={live} showPlayer={showPlayer} />
          <RosterTable arr={roster} type={3} live={live} showPlayer={showPlayer} />
          <RosterTable arr={roster} type={4} live={live} showPlayer={showPlayer} />
        </div>
      </div>
      <div className="players-container">
        <div>
          <RosterTable arr={roster} type={0} live={live} showPlayer={showPlayer} />
        </div>
      </div>
    </div>
  )
}

/**
 * Create Tables with active players on the gameweek.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').Pick} props.arr 
 */
const RosterTable = ({ arr, type, live, showPlayer }) => {
  const config = [
    { label: 'Bench', css: 'bench' },
    { label: 'Goalkeeper', css: 'role-bg1' },
    { label: 'Defenders', css: 'role-bg2' },
    { label: 'Midfielders', css: 'role-bg3' },
    { label: 'Forwards', css: 'role-bg4' }
  ];
  let value = 0;
  let points = 0;
  let played_value = 0;
  const { getPlayerByElement, getPointsFromLiveData } = usePremierData();
  // Filter players based on their type
  const rows = arr.reduce((result, i) => {
    let p = getPlayerByElement(i.element);
    let player_points = getPointsFromLiveData(p.id, live);
    // Get bench players
    if (type === 0 && i.multiplier <= 0) {
      value += p.now_cost;
      points += player_points * i.multiplier
      played_value += player_points ? p.now_cost : 0;
      result.push({
        player: p,
        info: i
      });
    }
    // Check player type, select only player that are given type.
    else if (p.element_type === type && i.multiplier > 0) {
      value += p.now_cost;
      points += player_points * i.multiplier
      played_value += player_points ? p.now_cost : 0;
      result.push({
        player: p,
        info: i,
        //points: getPointsFromLiveData(i.element, live)
      });
    }
    return result;
  }, []);

  return (
    <table className="roster-table">
      <thead className={`roster-heading ${config[type].css}`}>
        <tr>
          <th className="roster-list-status"></th>
          <th className="roster-list-element">
            <div className="roster-header-cell">
              <div className="header-cell-container">{config[type].label}</div>
              <div className="header-cell-container smaller-text">Played: £{played_value/10}/{value/10}</div>
            </div>
          </th>
          <th className="roster-list-stat">
            <div>Points{points ?<span className="smaller-text"> ({points})</span>:null}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        { rows.map((r, i) => {
          return <RosterTableRow key={i} data={r} live={live} showPlayer={showPlayer} />
        }) }
      </tbody>
    </table>
  )
}

/**
 * 
 * @param {Object} props 
 * @param {Object} props.data
 * @param {import('../../../PremierContext/premier').Pick} props.data.info
 * @param {import('../../../PremierContext/premier').Element} props.data.player
 * @param {import('../../../PremierContext/premier').Live} props.live
 */
const RosterTableRow = ({ data, live, showPlayer }) => {

  const { getTeamById, getTeamShirt, getPointsFromLiveData, useGetFixtures } = usePremierData();
  const { data: fixtureData, loading } = useGetFixtures(data.player.id);
  const team = getTeamById(data.player.team);
  const shirt = getTeamShirt(data.player);
  const points = getPointsFromLiveData(data.player.id, live);
  const [ fixture, setFixture ] = useState(null);

  useEffect(() => {
    if (fixtureData) {
      setFixture(fixtureData);
    }
    return () => {
      setFixture(null);
    }
  }, [ fixtureData ] );

  return (
    <tr>
      <td></td>
      <td className="element-cell">
        <div className="element-styled-media" onClick={() => showPlayer(data.player)}>
          <div className="element-media-img">
            <picture>
              <source></source>
              <img 
                alt={team.name}
                className="element-media-shirt" 
                src={`${shirt}-66.png`} 
                srcSet={`${shirt}-66.png 66w, ${shirt}-110.png 110w, ${shirt}-220.png 220w`}
                sizes="24px"
              ></img>
            </picture>
          </div>
          <div className="element-media-body">
            <div className="element-body-name">{data.info.is_captain ? <b>[C] </b>: (data.info.is_vice_captain ? <b>[V] </b>:null)}{data.player.web_name}</div>
            <div className="element-body-info">
              <Fixtures data={fixture} amount={4} mini />
            </div>
          </div>
        </div>
      </td>
      <td className="element-cell-stats">{points ? points*data.info.multiplier: null}</td>
    </tr>
  )
}