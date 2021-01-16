import React, { useState, useEffect, useContext } from 'react';
import usePremierData from '../../usePremierData';
import PremierContext from '../../../PremierContext';

import {
  Placeholder,
  Table
} from 'rsuite'; //https://github.com/tannerlinsley/react-table

/**
 * Render information about given league.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').ClassicObject} props.league - league 
 */
export default function LeagueInfo({ league }) {
  const { useLeagueStandings } = usePremierData();
  const { data, loading } = useLeagueStandings(league.id);

  // Update player fixtures
  /*
  useEffect(() => {
    if (data) {
      setStandings(data);
      console.log(data);
    }
    // Clean up
    return () => setStandings(null);
  }, [ data ]);*/

  return (
    <div className="league-info-wrapper">
      <div className="league-basic-info">
        <div><span>{/*league.name*/}</span></div>
        <div><span>{/*league.id*/}</span></div>
      </div>
      <div className="league-standings-wrapper">
        { loading ? <Placeholder.Paragraph /> : <StandingsTable data={data} /> }
      </div>
    </div>
  )
}

/**
 * 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').LeagueStandings} props.data
 */
const StandingsTable = ({ data }) => {
  const { Column, HeaderCell, Cell, Pagination } = Table;
  /**
   * entry, entry_name, event_total, id,
   * last_rank, player_name, rank, total
   */
  return (
    <Table
      virtualized
      height={300}
      data={data.standings.results}
    >
      <Column minWidth={20} flexGrow={1} align="center">
        <HeaderCell>Rank</HeaderCell>
        <Cell dataKey="rank" />
      </Column>
      <Column minWidth={200} flexGrow={2} align="left">
        <HeaderCell>Name</HeaderCell>
        <Cell dataKey="player_name" />
      </Column>
      <Column minWidth={30} flexGrow={2} align="center">
        <HeaderCell>Score</HeaderCell>
        <Cell dataKey="total" />
      </Column>
    </Table>
  )
}