import React, { useEffect, useState } from 'react';
import {
  ButtonGroup,
  Button,
  Container
} from 'rsuite';
import PremierContext from '../../PremierContext';
import LeagueInfo from '../components/LeagueInfo';
import usePremierData from '../usePremierData';

/**
 * 
 * @param {Object} props
 * @param {import('../../PremierContext/premier').EntryObject} props.user 
 */
export default function Leagues({ user }) {
  const [classic, setClassic] = useState([]);
  const [league, setLeague] = useState({});

  // Set users leagues, remove Gameweek 1 from it.
  useEffect(() => {
    if (user && user.leagues && user.leagues.classic.length) {
      let removed = user.leagues.classic.filter(cl => cl.name !== 'Gameweek 1');
      setClassic(removed);
      setLeague(removed[0]);
    }
    return () => { setClassic([]) }
  }, [ user ]);



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
        <div className="league-button-container">
          <ButtonGroup justified size="xs" className="league-buttons">
            {classic.map((cl, i) => {
              return <Button key={i} active={league.name === cl.name} onClick={() => selectLeague(cl)}>{cl.name} </Button>
            })}
          </ButtonGroup>
        </div>
        {league && league.id && <LeagueInfo league={league} />}
      </div>
      <div className="layout-secondary"></div>
    </div>
  )
}