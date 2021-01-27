import React, { useEffect, useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import PremierContext from '../../../PremierContext';
import usePremierData from '../../usePremierData';

import UserTeam from '../UserTeamSmall';

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
      size="md"
      aria-labelledby="contained-modal-title-center"
      centered
    >
      <Modal.Header className="modal-team-header" closeButton>
        <Modal.Title id="modal-team-title-center" className="modal-team-title" style={{ fontSize: '1rem', fontWeight: 'initial'}}>
          <TeamInfo user={user} roster={roster} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '0'}}>
        {!!roster.length && <UserTeam roster={roster} />}
      </Modal.Body>
    </Modal>
  )
}

const calcultaValue = (roster) => {
  if (!roster.length) return 0;
  else {
    return Object.values(roster).reduce((t, { played: {sum} }) => t + sum, 0);
  }
}

const getCaptain = (roster) => {
  if (!roster.length) return '???';
  else {
    let captain = roster.reduce((result, i) => {
      let check = i.players.filter(p => { return p.info.is_captain } );
      if (check.length) result.push(check[0].player.web_name);
      return result;
    }, []);
    return captain;
  }
}

/**
 * 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').StandingsPlayer} props.user - User Object 
 */
const TeamInfo = ({ user, roster }) => {
  const captain = React.useMemo(() => getCaptain(roster), [roster]);
  const teamValue = React.useMemo(() => calcultaValue(roster), [ roster ]);

  return (
    <div className="default-container-transparent" style={{ borderTopLeftRadius: '.2rem', borderTopRightRadius: '.2rem'}}>
        <div className="gameweek-wrapper">
          <div className="badge-banner">
            <div className="badge-banner-container">
              <div className="badge-banner-body">
                <div className="gameweek-info-wrapper">
                  <div className="gameweek-info-container">
                    <div style={{fontWeight: '700'}}>
                      <div><span style={{fontWeight: '700', fontSize: 'small'}}>Format</span></div>
                      <div><span>{roster && <small style={{fontSize: 'small'}}><b>{!!roster.length && `${roster[2].players.length}-${roster[3].players.length}-${roster[4].players.length}`}</b></small>}</span></div>
                      {/*<div><span style={{fontWeight: '700'}}>{currentGameweek.average_entry_score}</span></div>*/}
                    </div>
                  </div>
                  <div className="gameweek-info-container">
                    <div>
                      <div><span style={{fontWeight: '700', fontSize: 'small'}}>Value</span></div>
                      <div><span style={{fontWeight: '700'}}>{teamValue && <small style={{fontSize: 'small'}}><b>{`${teamValue/10}`}</b></small>}</span></div>
                    </div>
                  </div>
                </div>
                {<div><span>{roster && <small style={{fontSize: 'small'}}>Captain: <b>{captain}</b></small>}</span></div>}
              </div>
              <div className="badge-banner-title" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{user.player_name}</div>
            </div>
          </div>
          <div className="badge-banner">
            <div className="badge-banner-container">
              <div className="badge-banner-body">
                <div className="gameweek-user-points">{user.event_total}</div>
                <div className="gameweek-ranking">Total: {user.total}</div>
              </div>
              <div className="badge-banner-title">Points</div>
            </div>
          </div>
        </div>
      </div>
  )
}