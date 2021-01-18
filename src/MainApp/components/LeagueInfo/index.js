import React, { useState, useEffect, useContext } from 'react';
import usePremierData from '../../usePremierData';
import PremierContext from '../../../PremierContext';

import {
  Placeholder,
} from 'rsuite'; //https://github.com/tannerlinsley/react-table

import { useTable, useBlockLayout, useSortBy } from 'react-table';
import { FixedSizeList } from 'react-window';


function CustomCell({ value, row: { original } }) {
  return ( 
    <>
      <div className="league-table-standings-name">
        {value}
      </div>
      <div className="league-table-standings-team">{original.entry_name}</div>
    </>
  )
}

function PaddedCell({ value }) {
  return <div className="league-table-padded-cell">{value}</div>
}

/**
 * Render information about given league.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').ClassicObject} props.league - league 
 */
export default function LeagueInfo({ league, preview }) {
  const { useLeagueStandings } = usePremierData();
  const { data, loading } = useLeagueStandings(league.id);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Rank',
        accessor:'rank',
        Cell: PaddedCell
      },
      {
        Header: 'Name',
        accessor: 'player_name',
        Cell: CustomCell
      },
      {
        Header: 'Points',
        accessor: 'total',
        className: 'points-cell',
        Cell: PaddedCell
      },
    ],
    []
  )
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
        { loading ? <Placeholder.Paragraph /> : <Table columns={columns} data={data.standings.results} preview={preview} /> }
      </div>
    </div>
  )
}

/**
 * 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').LeagueStandings} props.data
 */

/*
const StandingsTable = ({ data }) => {
  const { Column, HeaderCell, Cell, Pagination } = Table;
  /**
   * entry, entry_name, event_total, id,
   * last_rank, player_name, rank, total
   */
  /*
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
}*/

function Table({ columns, data, preview }) {

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 20,
      width: 0,
      maxWidth: 200,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow
  } = useTable(
    { 
      columns, 
      data,
      defaultColumn
    }, 
    useSortBy,
    useBlockLayout
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td" onClick={() => preview(cell.row.original)}>
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows]
  )
  // Render the UI for the table
  return (
    <div className="league-table-container">
      <div {...getTableProps()} className="table">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        <div {...getTableBodyProps()}>
          <FixedSizeList
            height={280}
            itemCount={rows.length}
            itemSize={35}
            width={'100%'}          
          >
            {RenderRow}
          </FixedSizeList>
        </div>
      </div>
    </div>
  )
}