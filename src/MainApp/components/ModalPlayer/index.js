import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Fixtures from '../PlayerFixtures';
import History from '../PlayerHistory';
import usePremierData from '../../usePremierData';
/**
 * 
 * @param {Object} props 
 * @param {import('../../../PremierContext/premier').Element} props.player - Player data 
 */
export default function ModalPlayer({ show, onHide, player }) {
  const { useGetFixtures } = usePremierData();
  const { data: fixtureData, loading } = useGetFixtures(player.id);

  useEffect(() => {
    console.log('loading', loading);
  }, [ loading ]);

  useEffect(() => {
    console.log('data', fixtureData);
  }, [ fixtureData ]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="containde-modal-title-center modal-player-info"
      centered
    >
      <Modal.Header className="modal-playercard" closeButton>
        <PlayerHeader player={player} fixtures={fixtureData} />
      </Modal.Header>
      <Modal.Body className="modal-playercard-body">
        <small>Suggestions temporary removed.</small>
      </Modal.Body>
    </Modal>
  )
}

const PlayerHeader = ({ player, fixtures }) => {
  const { getPlayerPicture, getTeamById, getRole, getTeamBadge } = usePremierData();
  const picture = getPlayerPicture(player.code);
  const team = getTeamById(player.team);
  const role = getRole(player.element_type);
  const badge = getTeamBadge(team);

  return (
    <Modal.Title id="contained-modal-title-center" className="player-banner">
      {/* Player news/ injure status */}
      <div className={`banner-player-news player-status-${player.status}`}>{player.news}</div>
      {/* Basic info of player. Name, image, role */}
      <div className="banner-player-basic-info">
        <div className={`banner-player-image-container border-bg${player.element_type}`}>
          <picture>
            <source></source>
            <img 
              alt={`mugshot of ${player.web_name}`}
              className="banner-player-image-small" 
              src={picture} 
              srcSet={`${picture} 220w`}
              sizes="100px"
            ></img>
          </picture>
        </div>
        <div className="banner-player-info-container">
          <div className="banner-player-name">
            <small style={{ fontWeight: '700' }}>{player.first_name} {player.web_name}</small>
          </div>
          <div style={{ display: 'flex' }}>
            <div className={`banner-player-role role-bg${player.element_type} pl-1 pr-2 font-italic`}>
              <small style={{ fontWeight: '600' }}>{role.singular_name}</small>
            </div>
            <div className="banner-player-team">
              <div className="team-badge">
                <img alt={`badge ${team.name}`} role="presentation" className="team-badge-styled"
                  sizes="(min-width: 1024px) 40px, 25px" src={`${badge}_40.png`}
                  srcSet={`${badge}_40.png 40w, ${badge}_80.png 80w`}
                />
              </div>
              <div><small style={{ fontWeight: '700', lineHeight: 'normal' }}>{team.name}</small></div>
            </div>
          </div>
          <div className="banner-player-fixtures">
            <Fixtures data={fixtures} amount={6} />
          </div>
        </div>
      </div>
      <div className="banner-player-additional-info">
        {fixtures && <History fixtures={fixtures} type={player.element_type}/>}
      </div>
      {/*
      <div className="banner-player-info pt-3">
        <div className="banner-player-name">
          <b><small style={{fontWeight: 700}}>{player.first_name} {player.web_name}</small></b>
        </div>
        <div className={`banner-player-role role-bg${player.element_type} pl-2 pr-2 font-italic`}>
          <h5>{'Player role'}</h5>
        </div>
        <div className="banner-player-team">
          <small>{'Team name'}</small>
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
      </div>*/}
    </Modal.Title>
  )
}