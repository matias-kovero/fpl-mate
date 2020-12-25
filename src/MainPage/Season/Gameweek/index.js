import React from 'react';

import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import PlayerCard from '../Playercard';

/**
 * Display basic info about selected gameweek
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').Event[]} props.gameweeks - Gameweeks 
 */
export default function Gameweek({ gameweeks, context }) {
  const [ gameweek, setGameweek] = React.useState(getCurrentGameweek(gameweeks));
  console.log(context);
  const handleChange = (gw) => {
    console.log(gw);
    setGameweek(gw);
  }
  
  return (
    <Container>
      <DropdownButton id="gameweek-selector" size="sm" title={gameweek.name}>
        {gameweeks.map(gw => {
          return <Dropdown.Item key={gw.id} onClick={() => handleChange(gw)} href="">{gw.name}</Dropdown.Item>
        })}
      </DropdownButton>
      <br />
      { gameweek.highest_score && context.elements ?
      <>
        <p>Highest score: {gameweek.highest_score} <small>(AVG: {gameweek.average_entry_score})</small></p>
        <p>MVP <small>(Score: {gameweek.top_element_info.points})</small></p>
        <PlayerCard id={gameweek.top_element} context={context} />
        <p>Captain</p>
        <PlayerCard id={gameweek.most_captained} context={context} />
        <p>Vice-Captain</p>
        <PlayerCard id={gameweek.most_vice_captained} context={context} />
        <p>Transfered</p>
        <PlayerCard id={gameweek.most_transferred_in} context={context} />
        <p>Selected</p>
        <PlayerCard id={gameweek.most_selected} context={context} />
      </>
      : null }
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