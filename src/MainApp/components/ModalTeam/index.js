import React, { useEffect, useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import PremierContext from '../../../PremierContext';
import usePremierData from '../../usePremierData';

import UserTeam from '../UserTeam';

/**
 * Render users current picks.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').StandingsPlayer} props.user - User Object 
 * @param {Boolean} props.show - State if we shold this modal or not
 * @param {Function} props.onHide - callback to close the modal
 */
export default function ModalTeam({ user, show, onHide }) {
  const { fixtures } = useContext(PremierContext);
  const { useGetPick, useLiveData, calculateRoster, currentGameweek, getPlayerByElement, getTeamById } = usePremierData();
  const { data: picks, loading: pickLoading } = useGetPick(user.entry, currentGameweek.id);
  const { data: live, loading: liveLoading } = useLiveData(currentGameweek.id);
  const [roster, setRoster] = useState([]);

  useEffect(
    () => {
      if (picks && live) { 
        loadstuff();
      }
    }, [ picks, live, user ]
  )

  /**
   * LEGACY, THIS SHOULD BE MOVED TO usePremierData()
   */
  const loadstuff = () => {
    // Get all fixture information, and cut it down to next 6 fixtures
    let limitedFixture = fixtures.filter(f => f.event >= currentGameweek.id && f.event < (currentGameweek.id + 6));
    let teamCodes = []; // Save team codes, to fetch team info later.
    let players = []; // List of players and information of them.
    let teams = []; // list of teams and infromation of them.
    let squad = { points: 0, data: [] }; // Save our information of users picks here

    // Enrich player data and get all team codes on the roster.
    picks.picks.forEach(p => {
      let player = getPlayerByElement(p.element);
      players.push({ player, ...p });

      if (!teamCodes.includes(player.team)) teamCodes.push(player.team);
    });

    // Enrich teams data with their upcoming fixtures.
    teamCodes.forEach(t => {
      let team = getTeamById(t);
      let matches = limitedFixture.filter(f => f.team_a === team.id || f.team_h === team.id);
      let gameweek = matches.filter(f => f.event === currentGameweek.id);
      teams.push({ gameweek, ...team });
    });

    // Finally calulate all needed information to render team.
    squad = calculateRoster(picks.picks, live, teams);
    setRoster(squad.data);
  }

  // Render the team
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="contained-modal-title-center"
      centered
    >
      <Modal.Header className="modal-team-header" closeButton>
        <Modal.Title id="modal-team-title-center" className="modal-team-title">
          <div className="modal-team-title-container">
            <div className="modal-team-title-name">{user.player_name}</div>
            <div className="modal-team-title-event-total">Points: {user.event_total}</div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!roster.length && <UserTeam roster={roster} />}
      </Modal.Body>
    </Modal>
  )
}