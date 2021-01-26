import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';

import Fixtures from '../PlayerFixtures';
import PlayerSuggestions from '../PlayerSuggestion';
import SuggestionTable from '../PlayerSuggestion/temp';
import usePremierData from '../../usePremierData'; 

const useFixture = (player, initialValue) => {
  const { getElementInfo } = usePremierData();
  const [ data, setData ] = useState(initialValue);
  const [ loading, setLoading ] = useState(true);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch fixtures
      let fixtures = await getElementInfo(player.id);
      setData(fixtures);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [player]);
  useEffect(() => {
    fetchData();
  }, [ fetchData ]);
  return { loading, data };
}

/** 
 * This is a **MODAL COMPONENT**  
 * remeber to pass *show*, *onHide* props  
 * Displays player statistics 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').Element} props.player - Player data 
 */
export default function PlayerCard({ show, onHide, player }) {
  const { getPlayerPicture, getTeamById, getRole } = usePremierData();
  const [ fixtures, setFixtures] = useState();
  const [ picture, setPicture ] = useState();
  const [ team, setTeam ] = useState();
  const [ role, setRole ] = useState();
  const { loading, data } = useFixture(player, null);

  useEffect(() => {
    if (show && player) {
      setPicture(getPlayerPicture(player.code));
      setTeam(getTeamById(player.team));
      setRole(getRole(player.element_type));
    }
    // Clean up
    return () => {
      setPicture(null);
      setTeam(null);
      setRole(null);
    }
  }, [ player, show ]);

  // Update player fixtures
  useEffect(() => {
    if (data) {
      setFixtures(data);
    }
    // Clean up
    return () => {
      setFixtures(null);
    }
  }, [ data ]);

  if ( !player || !picture || !team || !role ) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-center modal-player-info"
      centered
    >
      <Modal.Header className="custom-player-view" closeButton>
        <Modal.Title id="contained-modal-title-center" className="player-banner">
          <div className={`banner-player-news player-status-${player.status}`}>{player.news}</div>
          <div className="banner-player-info pt-3">
            <div className="banner-player-name">
              <b><small style={{fontWeight: 700}}>{player.first_name} {player.web_name}</small></b>
            </div>
            <div className={`banner-player-role role-bg${player.element_type} pl-2 pr-2 font-italic`}>
              <h5>{role.singular_name}</h5>
            </div>
            <div className="banner-player-team">
              <small>{team.name}</small>
            </div>
            <div className="banner-player-stats">
              <div>
                <small>Value: £<b>{player.now_cost/10}</b> m</small> <br />
                <small>PPG: <b>{player.points_per_game}</b></small> <br />
                <small>PPM: <b>{Math.round(player.total_points / (player.now_cost/10) * 100) / 100}</b></small> <br />
              </div>
            </div>
            <div className="banner-fixtures">
              <Fixtures data={fixtures} amount={6} />
            </div>
          </div>
          <div className="banner-player-image">
            <img src={picture} style={{height: '13rem'}}></img>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Possible Replacements:</p>
        <SuggestionTable current={player} />
        {/*<PlayerSuggestions current={player} />*/}
      </Modal.Body>
      {/*
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>*/}
    </Modal>
  )
}