import React, { useEffect, useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import usePremierData from '../../usePremierData';
import PlayerCard from '../ModalPlayer';
import Fixtures   from '../PlayerFixtures';

/**
 * Returns string with all set-piece information.
 * P = Penalty,
 * F = Freekick,
 * C = Corner,
 * @param {import('../../../PremierContext/premier').Element} player 
 */
const setPieceString = (player) => {
  let arr = [];
  if (player.penalties_order) arr.push('P');
  if (player.direct_freeckicks_order) arr.push('F');
  if (player.corners_and_indirect_freekicks_order) arr.push('C');
  if (arr.length) return `( ${arr.join(', ')} )`;
}

export default function TeamContainer({ roster }) {
    const [ modal, setModal ] = useState(false);
    const [ info, setInfo ] = useState(null);

    // If no data, prevent render.
    if ( !roster ) return null;

    const showPlayer = (info) => {
      setInfo(info);
      setModal(true);
    }

    return (
      <div>
        { info ? <PlayerCard show={modal} onHide={() => setModal(false)} player={info} /> : null }
        <div >
          <div style={{ paddingTop: '1rem', paddingBottom: '1rem'}}>
            <RosterCard row={roster[1]} show={showPlayer} />
            <RosterCard row={roster[2]} show={showPlayer} />
            <RosterCard row={roster[3]} show={showPlayer} />
            <RosterCard row={roster[4]} show={showPlayer} />
            <br />
            <RosterCard row={roster[0]} show={showPlayer} />
          </div>
        </div>
      </div>
    )
}

const RosterCard = ({ row, show }) => {
  return (
    <Accordion>
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={row.name} className="team-row-container">
        <div className={`roster-heading ${row.css}`}>
        <div style={{ display: 'flex'}}>
          <div className="roster-list-status" role="th">%</div>
          <div className="roster-list-element" role="th">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="header-cell-container">{row.name}</div>
                <div className="header-cell-container smaller-text">Played: £{row.played.value/10}/{row.played.sum/10}</div>
              </div>
              <div style={{ marginRight: '2rem', paddingTop: '.4rem'}}>
                <div className="header-cell-container">Show more</div>
              </div>
            </div>
          </div>
          <div className="roster-list-stat" role="th">
            <div>
              <div className="header-cell-container cell-small">Points</div>
              <div className="header-cell-container smaller-text">{row.played.points}</div>
            </div>
          </div>
        </div>
      </div>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={row.name}>
        <Card.Body className="team-row-container">
          { row.players.map((p, i) => {
            return <RosterPlayer key={i} data={p} show={show} />
          })}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
    </Accordion>
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
const RosterPlayer = ({ data, show }) => {
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
    <div style={{ display: 'flex', borderBottom: '1px solid rgb(239, 239, 239)' }}>
      <div role="td" className="team-row-cell-pr">{data.player.selected_by_percent}</div>
      <div role="td" className="team-row-element-cell">
        <div className="element-styled-media" onClick={() => show(data.player)}>
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
            <div className={`element-status player-status-${data.player.status}`}></div>
          </div>
          <div className="element-media-body">
            <div className="element-body-name">{data.info.is_captain ? <b>{data.info.multiplier === 3 ? '[3xC]' : '[C]'} </b>: (data.info.is_vice_captain ? <b>[V] </b>:null)}{data.player.web_name} <small>{setPieceString(data.player)}</small></div>
            <div className="element-body-info">
              <Fixtures data={fixture} amount={5} mini />
            </div>
          </div>
        </div>
      </div>
      <div role="td" className="team-row-element-stats">{data.points.bonus ? <div>{data.points.bonus + data.points.value} <span className="player-points-info">({data.points.value} + {data.points.bonus})</span></div> : data.points.value ? `${data.points.value}` : null}</div>
    </div>
  )
}