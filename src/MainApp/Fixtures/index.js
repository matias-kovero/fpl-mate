import React, { useMemo, useState, useEffect } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import {
  ButtonGroup,
  Button,
} from 'rsuite';
import PlayerCard from '../components/PlayerCard';

import usePremierData from '../usePremierData'; 

const lastIndexOf = (array, key, value) => {
  for (var i = array.length - 1; i >= 0; i--) {
    if (new Date(array[i][key]).getDate() === value) return i;
  }
  return -1;
}
/**
 * @param {import('../../PremierContext/premier').Match[]} matches - Gameday matches
 */
const filterGameDays = (matches) => {
  return matches.reduce((result, match, i, arr) => {
    let match_day = new Date(match.kickoff_time).getDate();
    let last_match_otd = lastIndexOf(arr, 'kickoff_time', match_day);
    if (last_match_otd <= i) { // We found the last match
      result.push({
        match_day: match_day,
        day_text: new Date(match.kickoff_time).toDateString(),
        matches: arr.reduce((day, m) => { // add all matches of curr date to the array
          if (new Date(m.kickoff_time).getDate() === match_day) {
            day.push(m);
          }
          return day;
        }, []) 
      });
    }
    return result;
  }, []);
}

/**
 * Display season all fixtures.
 * Buttons to view previous and next gameweeks.
 * @param {*} param0 
 */
export default function Fixtures() {
  const { currentGameweek, matches, getGameweek, fetchFixtures } = usePremierData();
  const [ offset, setOffset ] = useState(0);    // Used to offset gameweek from current week.
  const [ player, setPlayer ] = useState(null); // Used to show playercard.
  const [ modal, setModal ] = useState(false);  // Used to handle modal popup.
  const gameweek = getGameweek((currentGameweek.id + offset));
  const kickoffs = useMemo(() => filterGameDays(matches((currentGameweek.id + offset))), [ currentGameweek, matches, offset ]);
  const deadline = new Date(gameweek.deadline_time).toDateString().slice(0, -4); // Remove last 4 digits (year)
  const time = new Date(gameweek.deadline_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  // Fetch new fixtures when offset changes
  const fix = useMemo(async() => await fetchFixtures(), [ offset ]);

  const showPlayer = (info) => {
    if (!info) return; // Huge issue if we land here!
    setPlayer(info);
    setModal(true);
  }

  // When switching get fixtures information again -> as it might update scores!

  return (
    <div className="layout-wrapper">
      {player ? <PlayerCard show={modal} onHide={() => setModal(false)} player={player} /> : null}
      <div className="layout-main">
      <h5 className="gameweek-deadline">{gameweek.name} - {deadline} {time}</h5>
        <div className="pager-container">
          <div className="pager-button">
            <button className="arrow-button" onClick={() => setOffset(offset-1)} disabled={gameweek.is_first}><div>❰</div>Previous</button>
          </div>
          <div className="pager-button-next">
            <button className="arrow-button" onClick={() => setOffset(offset+1)} disabled={gameweek.is_last}>Next<div>❱</div></button>
          </div>
        </div>
        <br/>
        { kickoffs.map((match_day, i) => {
            return (
              <div key={i} className="fixture-day-container">
                <h4 className="fixture-day">
                  <time dateTime={''}>{match_day.day_text}</time>
                </h4>
                <Accordion className="fixture-list">
                  { match_day.matches.map((k, i) => {
                    return <Match key={i} data={k} number={i} showPlayer={showPlayer} />
                  })}
                </Accordion>
              </div>
            )
          })}
      </div>
      <div className="layout-secondary"></div>
    </div>
  )
}

/**
 * Display basic information of a match. 
 * @param {Object} props
 * @param {import('../../PremierContext/premier').Match} props.data - Match Data 
 */
export function Match({ data, number, showPlayer }) {
  const { getTeamById, getTeamBadge } = usePremierData();
  const home = getTeamById(data.team_h);
  const away = getTeamById(data.team_a);
  const h_badge = getTeamBadge(home);
  const a_badge = getTeamBadge(away);

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={number.toString()} className="match-container">
        <div className="home-team">
          <span className="match-team-name">{home.name}</span>
          <div className="team-badge">
            <img alt={`badge ${home.name}`} role="presentation" className="team-badge-styled"
              sizes="(min-width: 1024px) 40px, 30px" src={`${h_badge}_40.png`}
              srcSet={`${h_badge}_40.png 40w, ${h_badge}_80.png 80w`}
            />
          </div>
        </div>
        { data.started ? <div className="match-score">
          <span className="team-score">{data.team_h_score}</span>
          <span className="team-score">{data.team_a_score}</span>
        </div> : <span className="fixture-time">{new Date(data.kickoff_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span> }
        <div className="away-team">
          <div className="team-badge">
            <img alt={`badge ${away.name}`} role="presentation" className="team-badge-styled"
              sizes="(min-width: 1024px) 40px, 30px" src={`${a_badge}_40.png`}
              srcSet={`${a_badge}_40.png 40w, ${a_badge}_80.png 80w`}
            />
          </div>
          <span className="match-team-name">{away.name}</span>
        </div>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={number.toString()}>
        <Card.Body className="fixture-stats-wrapper">{data.stats.length ? 
        <MatchWrapper data={data} showPlayer={showPlayer} />
         : <p style={{textAlign: 'center', fontSize: 'small'}}>No events yet on the match.</p>}</Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}
const LISTTYPE = ['Players', 'Stats'];
export function MatchWrapper({ data, showPlayer }) {
  const [ selected, setSelected ] = useState(LISTTYPE[0]);

  return (
    <>
      <div className="list-type-button-container">
        <ButtonGroup justified size="xs" className="list-type-buttons">
          { LISTTYPE.map((type, i) => {
            return <Button key={i} active={selected === type} onClick={() => setSelected(type)}>{type}</Button>
          }) }
        </ButtonGroup>
      </div>
      {selected === LISTTYPE[0] ? 
        <PlayerList data={data} showPlayer={showPlayer} /> :
        <ul>
          { data.stats.map((stats, i) => {
            return (stats.a.length || stats.h.length ? <MatchStat key={i} stats={stats} showPlayer={showPlayer} /> : null)
          })}
        </ul>
      }
    </>
  )
}

/**
 * 
 * @param {Object} props
 * @param {import('../../PremierContext/premier').MatchStats} props.stats - Current stats of the match 
 */
export function MatchStat({ stats, showPlayer }) {
  const { getElementLabel } = usePremierData();
  const label = getElementLabel(stats.identifier);

  return (
    <li className="fixture-stats">
      <div className="fixture-stats-heading">{label}</div>
      <div className="fixture-stats-body">
        <ul className="fixture-stats-list">
          { stats.h.slice(0,5).map((s, i) => {
            return <PlayerElement key={i} data={s} showPlayer={showPlayer} />
          }) }
        </ul>
        <ul className="fixture-stats-list">
          { stats.a.slice(0,5).map((s, i) => {
            return <PlayerElement key={i} data={s} showPlayer={showPlayer} />
          }) }
        </ul>
      </div>
    </li>
  )
}

/**
 * Display players name and made points. When clicked opens playercard.
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.data.element
 * @param {String} props.data.value - 
 */
export function PlayerElement({ data, showPlayer }) {
  const { getPlayerByElement } = usePremierData();
  const player = getPlayerByElement(data.element);

  return (
    <li className="fixture-stats-item">
      <button className="fixture-stats-element" onClick={() => showPlayer(player)}>
        {player.web_name} </button> ({data.value})
    </li>
  )
}

const getPlayers = (match, live, calculateGame) => {
  if (!live || !live.elements.length) return null;
  console.log('Match', match, 'live', live);
  let elements = [];

  // Loop all gamestats, and add element Id's to an array.
  elements = match.stats.reduce((result, i, arr) => {
    // Check i.a && i.h, both are possible arrays of players with point giving attributes.
    let players = i.a.concat(i.h);
    if (players.length) {
      // Getting only players element Id
      let ids = players.map(e => e.element);
      result.push(...ids);
    }
    return result;
  }, []);

  // Array might contain duplicates, removing them.
  elements = [... new Set(elements)];

  let calculated_players = calculateGame(elements, live, match);
  console.log(calculated_players);
  return calculated_players;
}

export function PlayerList({ data, showPlayer }) {
  const { currentGameweek, useLiveData, getPointsFromLiveData, calculateGame } = usePremierData();
  const { data: liveData, loading } = useLiveData(currentGameweek.id);
  const players = useMemo(() => getPlayers(data, liveData, calculateGame), [ data, liveData ]);
/*
  useEffect(() => {
    if (loading) console.log('Waiting for live D');
    if (!loading) {
      console.log('Parsed:', players);
      console.log('Live D', liveData);
    }
  }, [ data, loading ]); */

  return (
    <table className="roster-table fixture-players-list">
      <thead className="fixture-table-heading">
        <tr>
          <th className="roster-list-status">%</th>
          <th className="roster-list-element">
            <div className="roster-header-cell">
              <div className="header-cell-container">Player</div>
              <div className="header-cell-container smaller-text"></div>
            </div>
          </th>
          <th className="roster-list-stat">
            <div className="roster-header-cell">
              <div className="header-cell-container cell-small">Points</div>
              <div className="header-cell-container smaller-text"></div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {players && players.map((p, i) => {
          return <PlayerCell key={i} data={p} showPlayer={showPlayer} />
        }) }
      </tbody>
    </table>
  )
}

/**
 * Generate list view of acclaimed points to player from specific match data.
 * @param {*} data 
 */
const parseMatchData = (data, live, getPoints) => {
  console.log('Data', data, 'live', live);
  let players = [];
  if (!live) return null;

  // Loop all gamestats, and add element Id's to an array.
  players = data.stats.reduce((result, i, arr) => {
    // Check i.a && i.h, both are possible arrays of players with point giving attributes.
    let elements = i.a.concat(i.h);
    if (elements.length) {
      // Getting only players element Id
      let ids = elements.map(e => e.element);
      result.push(...ids);
    }
    return result;
  }, []);

  // Array might contain duplicates, removing them.
  players = [... new Set(players)];

  // !!! Retarded logic warning !!!
  let calculated_players = players.map(p => {
    let player = live.elements.find(e => e.id === p);
    // Check if points acclaimed in current match!
    // Need this as might be multiple matches per week.
    let match = player.explain.find(e => e.fixture === data.id);
    if (match) {
      let ovr_points = getPoints(p, live);
      return { element: p, stats: [...match.stats], points: ovr_points };
    }
  });

  // Sort players by points
  calculated_players.sort((a,b) => b.points - a.points);

  return calculated_players;
}
/**
 * 
 * @param {Object} props
 * @param {Object} props.data - Data object
 * @param {import('../../PremierContext/premier').Element } props.data.player - Player Element 
 */
export function PlayerCell({ data, showPlayer }) {
  const { getTeamShirt, getTeamById } = usePremierData();
  //const player = getPlayerByElement(data.element);
  const shirt = getTeamShirt(data.player);
  const team = getTeamById(data.player.team);

  return (
    <tr>
      <td className="element-cell-pr">{data.player.selected_by_percent}</td>
      <td className="element-cell">
        <div className="element-styled-media" onClick={() => showPlayer(data.player)}>
          <div className="element-media-body" style={{ paddingLeft: '0.6rem'}}>
            <div className="element-body-name">{data.player.web_name}</div>
            <div className="element-body-info">
              <div className="fixture-table-teamname">
                {team.name}
              </div>
            </div>
          </div>
          <div className="element-media-body fixture-table-addinfo">
            { data.cards.yellow ? 
              <div>
               <span className="yellow-card"></span>
              </div> 
            : null }
            { data.cards.red ? 
              <div>
               <span className="red-card"></span>
              </div> 
            : null }
          </div>
        </div>
      </td>
      <td className="element-cell-stats">{data.points.bonus ? <div>{data.points.bonus + data.points.value} <span className="player-points-info">({data.points.value} + {data.points.bonus})</span></div> : data.points.value}</td>
    </tr>
  ) 
}