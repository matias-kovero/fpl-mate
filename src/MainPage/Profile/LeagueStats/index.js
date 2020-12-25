import React, { useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';
import UserStats    from './UserStats';

export default function LeagueInfo({ context, id }) {
  const [ league, setLeague ] = useState({ standings: { results: [] } });
  const [ modalShow, setModalShow ] = useState(false);
  const [ player, setPlayer ] = useState(null);

  useEffect(() => {
    // No league stats on context!
    const fetchData = async (id) => {
      const results = await context.GetLeagueInfo(id);
      setLeague(results);
    }
    fetchData(id);
  }, []);

  return (
    <> { league ? 
      <>
      <UserStats player={player} context={context} show={modalShow} onHide={() => setModalShow(false)}/>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Points</th>
            <th>Owner</th>
            <th>GW (points)</th>
          </tr>
        </thead>
        <tbody>
          {league.standings.results.map(player => {
            return <tr key={player.id} onClick={() => { 
              setPlayer(player.entry);
              setModalShow(true);
              }}>
              <td>{player.rank}</td>
              <td>{player.entry_name}</td>
              <td>{player.total}</td>
              <td>{player.player_name}</td>
              <td>{player.event_total}</td>
            </tr>
          })}
        </tbody>
      </Table>
    </> :
    <p>No league stats</p>
    }
    </>
  )
}