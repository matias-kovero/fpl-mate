import React, { useEffect, useState, useMemo } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Fixtures from '../Fixtures';

// https://resources.premierleague.com/premierleague/photos/players/110x140/p178186.png
const IMAGE_BASE_URL = "https://resources.premierleague.com/premierleague/photos/players/110x140/p"; // 178186.png";

/**
 * Display player statistics
 * @param {Object} props
 * @param {import('../../../../PremierContext/premier').Element} props.info - Player data 
 */
export default function PlayerStats({ show, onHide, info, context }) {
  const [ player, setPlayer ] = useState(info);
  const [ fixtures, setFixtures] = useState();
  const mugshot = useMemo(() => getPic(info), [ info ]);

  useEffect(() => {
    if (info && info.id) {
      setPlayer(info);
      const fetchData = async (id) => {
        // Get player fixture
        let fixture_res = await context.GetElementInfo(id);
        setFixtures(fixture_res);
      }
      fetchData(info.id);
    }
  }, [ info ]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-center modal-player-info"
      centered
    >
      { player ?
      <>
      <Modal.Header className="custom-player-view" closeButton>
        <Modal.Title id="contained-modal-title-center" className="player-banner">
          <div className="banner-player-info pt-3">
            <div className="banner-player-name">
              <b>{player.first_name} {player.second_name}</b>
            </div>
            <div className={`banner-player-role role-bg${player.element_type} pl-2 pr-2 font-italic`}>
              <h5>{getPlayerRole(player.element_type, context)}</h5>
            </div>
            <div className="banner-player-team">
              <small>{getPlayerTeam(player.team, context)}</small>
            </div>
            <div className="banner-player-stats">
              <b>Playing next round <small>{player.chance_of_playing_next_round ? player.chance_of_playing_next_round + '%' : "unknown"}</small></b>
              <p>Form <b>{player.form}</b></p>
            </div>
            <div className="banner-fixtures">
              <Fixtures data={fixtures} context={context} amount={6} />
            </div>
          </div>
          <div className="banner-player-image">
            <img src={mugshot} style={{height: '13rem'}}></img>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Possible Replacements:</h4>
        <p>List players...</p>
        <h5>Top 50 has:</h5>
        <p>List players...</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer> </>: null }
    </Modal>
  )
}

const getCurrentGameweek = (id, context) => {
  return context.season.events.find(t => t.id === id).name;
}

const getPic = (player) => {
  if (!player || !player.code) return '';
  return `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
}

/**
 * Gets player information from our context.
 * @param {Number} id PlayerId 
 * @returns {import('../../../../PremierContext/premier').Element} PlayerInfo 
 */
const getPlayer = (id, context) => {
  return context.elements.find(e => e.id === id);
}

const getPlayerRole = (id, context) => {
  return context.season.element_types.find(e => e.id === id).singular_name;
}

const getPlayerTeam = (id, context) => {
  return context.season.teams.find(t => t.id === id).name;
}