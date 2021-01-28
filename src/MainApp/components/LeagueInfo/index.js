import React, { useState, useEffect, useContext } from 'react';
import usePremierData from '../../usePremierData';
import PremierContext from '../../../PremierContext';

import {
  Placeholder,
} from 'rsuite'; //https://github.com/tannerlinsley/react-table

import { useTable, useBlockLayout, useSortBy } from 'react-table';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

function CustomCell({ value, row: { original } }) {
  return ( 
    <>
      <div className="league-table-standings-name" style={{paddingTop: '0.1rem'}}>
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
 * 
 * @param {Object} props
 * @param {Number} props.value
 * @param {Object} props.row
 * @param {import('../../../PremierContext/premier').StandingsPlayer} props.row.original
 */
function RankCell({ value, row: { original }}) {
  let change = original.last_rank - original.rank;
  /**
   * Values under 100k are displayed as localeString
   * Values over 100k but under 1m are still in localeString but small
   * Values over 1m are small
   */
  return <div className="league-table-padded-cell">
    <div className="league-table-rank-cell">
      <div>{value && value < 1000000 ?  value < 100000 ? value.toLocaleString() : <small>{value.toLocaleString()}</small> : <small>{value}</small>}</div>
      <div>
      {
        change !== 0 ? (change > 0 ? 
          <i className="fas fa-sort-up" style={{ color: 'green', verticalAlign: 'middle'}}></i> : 
          <i className="fas fa-sort-down" style={{ color: 'red', verticalAlign: 'text-top'}}></i>
          ) : <i className="fas fa-minus" style={{ color: 'gray', fontSize: 'smaller'}}></i>
      }
      </div>
    </div>
  </div>
}

/**
 * Render information about given league.
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').ClassicObject} props.league - league 
 */
export default function LeagueInfo({ league, preview, user }) {
  const context = useContext(PremierContext);
  const [ page, setPage ] = useState(1);
  const { useLeagueStandings, useUpdateStandings } = usePremierData();
  //const { data, loading } = useLeagueStandings(league.id);
  const { data: leagueData, loading: loadingData } = useUpdateStandings(league.id, page);
  const [ items, setItems ] = useState([]);
  const [ loading, setLoading] = useState(false);
  const [ has_next, setHasNext] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Rank',
        accessor:'rank',
        Cell: RankCell
      },
      {
        Header: 'Name',
        accessor: 'player_name',
        Cell: CustomCell
      },
      {
        Header: 'GW',
        accessor: 'event_total',
        Cell: PaddedCell
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
  // Set 1st page of standings
  useEffect(() => {
    if (leagueData && leagueData.standings) {
      setHasNext(leagueData.standings.has_next);
      setItems(leagueData.standings.results);
    }
  }, [ leagueData ]);

  const loadMore = (startIndex, endIndex) => {
    setLoading(true);
    return new Promise(async(resolve, reject) => {
      try {
        let json = await context.updateLeagueStandings(league.id, (startIndex/50)+1);
        let oldItems = items;
        setItems([...oldItems, ...json.standings.results ]);
        setHasNext(json.standings.has_next);
        resolve(json.standings.results);
      } catch (error) {
        reject(error);
      } finally {
        setLoading(false);
      }
    })
  }

  if (!leagueData) return null;

  return (
    <div className="league-info-wrapper">
      <div className="league-basic-info">
        <div><span>{/*league.name*/}</span></div>
        <div><span>{/*league.id*/}</span></div>
      </div>
      <div className="league-standings-wrapper">
        { !items.length ? 
          <div className="league-table-container">
            <Placeholder.Paragraph />
          </div> : 
          <Table 
            columns={columns} 
            data={items} 
            preview={preview} 
            user={user} 
            currentRank={league.entry_rank}
            prevRank={league.entry_last_rank}
            hasNextPage={has_next}
            isNextPageLoading={loading}
            loadNextPage={loadMore}
          />
        }
      </div>
    </div>
  )
}


/**
 * 
 * @param {Object} props 
 * @param {import('../../../PremierContext/premier').EntryObject} props.user - User Object
 */
function Table({ columns, data, preview, user, currentRank, prevRank, hasNextPage, isNextPageLoading, loadNextPage }) {
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
      if (!isItemLoaded(index)) {
        return <div>Loading...</div>
      } else {
        prepareRow(row);
        return (
          <div
            {...row.getRowProps({
              style,
            })}
            className={`tr${row.original.entry === user.id ?' active':''}`}
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
      }
    },
    [prepareRow, rows]
  )

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? rows.length + 1 : rows.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = index => !hasNextPage || index < rows.length;

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
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems} 
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={rows.length < 8 ? rows.length*35.5 : 280}
                itemCount={itemCount}
                onItemsRendered={onItemsRendered}
                ref={ref}
                itemSize={35}
                width={'100%'}          
              >
                {RenderRow}
              </FixedSizeList>
            )}
          </InfiniteLoader>
          <div 
            role="row" 
            className="tr active" 
            style={{display: 'flex', height: '35px', border: '1px #000 solid', marginTop: '0.1rem'}}
            onClick={() => preview({ 
              entry: user.id, 
              player_name: `${user.player_first_name} ${user.player_last_name}`, 
              event_total: user.summary_event_points,
              total: user.summary_overall_points
            }) }
          >
            <div role="cell" className="td"><RankCell value={currentRank} row={{original: { last_rank: prevRank, rank: currentRank }}} /></div>
            <div role="cell" className="td"><CustomCell value={`${user.player_first_name} ${user.player_last_name}`} row={{original: {entry_name: user.name}}}/></div>
            <div role="cell" className="td"><PaddedCell value={user.summary_event_points} /></div>
            <div role="cell" className="td"><PaddedCell value={user.summary_overall_points} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}