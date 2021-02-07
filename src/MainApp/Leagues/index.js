import React, { useEffect, useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import PremierContext from '../../PremierContext';
import LeagueInfo from '../components/LeagueInfo';
import ModalTeam from '../components/ModalTeam';
import usePremierData from '../usePremierData';

/**
 * 
 * @param {Object} props
 * @param {import('../../PremierContext/premier').EntryObject} props.user 
 */
export default function Leagues({ user }) {
  const [classic, setClassic] = useState([]);
  const [league, setLeague] = useState({});
  const [modal, setModal] = useState(false);
  const [player, setPlayer] = useState(null);

  // Set users leagues, remove Gameweek 1 from it.
  useEffect(() => {
    if (user && user.leagues && user.leagues.classic.length) {
      let removed = user.leagues.classic.filter(cl => cl.name !== 'Gameweek 1');
      setClassic(removed);
      setLeague(removed[0]);
    }
    return () => { setClassic([]) }
  }, [ user ]);

  const showPlayer = (p) => {
    setPlayer(p);
    setModal(true);
  }

  /**
   * 
   * @param {import('../../PremierContext/premier').ClassicObject} league 
   */
  const selectLeague = (league) => {
    setLeague(league);
  }

  //
  return (
    <div className="layout-wrapper">
      <div className="layout-main">
        { player ? <ModalTeam show={modal} onHide={() => setModal(false)} user={player} /> : null }
        <div className="league-button-container">
          <ButtonGroup size="sm" className="league-buttons">
            {classic.map((cl, i) => {
              return <Button variant="light" key={i} active={league.name === cl.name} onClick={() => selectLeague(cl)}>{cl.name} </Button>
            })}
          </ButtonGroup>
        </div>
        {user && league && league.id && <LeagueInfo league={league} preview={showPlayer} user={user} />}
      </div>
      <div className="layout-secondary"></div>
    </div>
  )
}