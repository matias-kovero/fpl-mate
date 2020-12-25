import React, { useEffect, useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Row, Col } from 'react-bootstrap';

import Subtitute from './Subtitutes';
import TeamPreview from '../../TeamPreview';

/**
 * Display users roster information
 * @param {*} props 
 */
export default function UserStats(props) {
  const [ league, setLeague ] = useState({ standings: { results: [] } });
  const [ player, setPlayer ] = useState(null);
  const [ picks, setPicks] = useState(null);

  useEffect(() => {
    // No league stats on context!
    if (props.player) {
      const fetchData = async (id) => {
        let [player_res, picks_res] = [await props.context.GetPlayerInfo(id), await props.context.GetPicks(id, 10)];
        setPicks(picks_res);
        setPlayer(player_res);
      }
      fetchData(props.player);
    }
  }, [ props.player ]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {player && picks ?
      <>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {player.name} <small>({player.summary_overall_points})</small>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{getCurrentGameweek(player.current_event, props.context)} {picks.active_chip ? <small>({picks.active_chip})</small> : null}</h4>
        <TeamPreview team={player} context={props.context} />
        <Row>
          <Col xs={3}>
            <div>
              <p>Autosubs</p>
              <Col className="auto-subs-container">
                { picks.automatic_subs.map((subs, i) => {
                  return <Subtitute subtitute={subs} context={props.context} />
                }) }
              </Col>
            </div>
          </Col>
          <Col>
            <div>Picks</div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> </>: null }
    </Modal>
  )
}

const getCurrentGameweek = (id, context) => {
  return context.season.events.find(t => t.id === id).name;
}