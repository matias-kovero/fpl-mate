import React, { useEffect, useState } from 'react';
import usePremierData from '../../usePremierData';
import PlayerCard from '../PlayerCard';
import Fixtures   from '../PlayerFixtures';

/**
 * List users current team.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').EntryObject} props.team - Users data
 */
export default function UserTeam({ roster }) {
  const [ modal, setModal ] = useState(false);
  const [ info, setInfo ] = useState(null);

  // Fetch team information
  /*
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
  }, [ liveData ]);*/

  const showPlayer = (info) => {
    setInfo(info);
    setModal(true);
  }

  // If no data, prevent render.
  if ( !roster ) return null;

  return (
    <div className="roster-wrapper">
      { info ? <PlayerCard show={modal} onHide={() => setModal(false)} player={info} /> : null }
      <div className="players-container">
        <div>
          <RosterTable row={roster[1]} showPlayer={showPlayer} />
          <RosterTable row={roster[2]} showPlayer={showPlayer} />
          <RosterTable row={roster[3]} showPlayer={showPlayer} />
          <RosterTable row={roster[4]} showPlayer={showPlayer} />
        </div>
      </div>
      <div className="players-container">
        <div>
          <RosterTable row={roster[0]} showPlayer={showPlayer} />
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
const RosterTable = ({ showPlayer, row }) => {

  return (
    <table className="roster-table">
      <thead className={`roster-heading ${row.css}`}>
        <tr>
          <th className="roster-list-status">%</th>
          <th className="roster-list-element">
            <div className="roster-header-cell">
              <div className="header-cell-container">{row.name}</div>
              <div className="header-cell-container smaller-text">Played: £{row.played.value/10}/{row.played.sum/10}</div>
            </div>
          </th>
          <th className="roster-list-stat">
            <div className="roster-header-cell">
              <div className="header-cell-container cell-small">Points</div>
              <div className="header-cell-container smaller-text">{row.played.points}</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        { row.players.map((player, i) => {
          return <RosterTableRow key={i} data={player} showPlayer={showPlayer} />
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
const RosterTableRow = ({ data, showPlayer }) => {

  const { getTeamById, getTeamShirt, useGetFixtures } = usePremierData();
  const { data: fixtureData, loading } = useGetFixtures(data.player.id);
  const team = getTeamById(data.player.team);
  const shirt = getTeamShirt(data.player);
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
      <td className="element-cell-pr">{data.player.selected_by_percent}</td>
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
              <Fixtures data={fixture} amount={5} mini />
            </div>
          </div>
        </div>
      </td>
      <td className="element-cell-stats">{data.points.bonus ? `${data.points.bonus + data.points.value} (${data.points.value} + ${data.points.bonus})`: data.points.value ? `${data.points.value}` : null}</td>
    </tr>
  )
}