import React, { useEffect } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
const IMG_BASE_URL = `https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/40x40/p`;
/**
 * Display basic info about selected gameweek
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').Event[]} props.gameweeks - Gameweeks 
 */
export default function Playercard({ id, context }) {
  const [ player, setPlayer] = React.useState(getPlayer(id, context.elements));

  useEffect(() => {
    if (player.id !== id) {
      setPlayer(getPlayer(id, context.elements));
    }
  }, [id])

  const handleChange = (gw) => {
    console.log(gw);
  }
  
  return (
    <Container>
      <Row noGutters>
        <Col xs="auto">
          <div className="player-image-container pr-2">
            <img 
              src={`${IMG_BASE_URL}${player.code}.png`} 
              alt={`Player image of ${player.web_name}`}
              className="player-image"
            ></img>
          </div>
        </Col>
        <Col xs={3}>
          <b>{player.web_name}</b>
          <p style={{marginTop: '-.6em', marginBottom: '0px'}}><small>{getPlayerType(player.element_type, context)} - {getPlayerTeam(player.team, context)}</small></p>
          <p><small>PPG: {player.points_per_game} PR%: {player.selected_by_percent}</small></p>
        </Col>
      </Row>
    </Container>
  )
}

/**
 * Finds the current gameweek
 * @param {import('../../../PremierContext/premier').Event[]} gameweeks 
 */
const getCurrentGameweek = (gameweeks) => {
  return gameweeks.find(gw => gw.is_current);
}

/**
 * Gets player information from our context.
 * @param {Number} id PlayerId 
 * @param {import('../../../PremierContext/premier').Element[]} elements - Context element array
 * @returns {import('../../../PremierContext/premier').Element} PlayerInfo 
 */
const getPlayer = (id, elements) => {
  return elements.find(e => e.id === id);
}

const getPlayerType = (id, context) => {
  return context.season.element_types.find(e => e.id === id).plural_name_short.charAt(0);
}
/**
 * 
 * @param {Number} id - Teams ID 
 * @param {*} context 
 */
const getPlayerTeam = (id, context) => {
  return context.season.teams.find(t => t.id === id).short_name;
}