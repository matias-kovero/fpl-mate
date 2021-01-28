import React from 'react';

import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList } from 'react-window';

const GWCell = ({ value, row: { original } }) => {
  return <div className="player-history-header">{value}</div>
}
/**
 * Sort array data to show latest gameweek on the top.
 */
const sortData = (data) => {
  if (!data || !data.history.length) return [];
  return data.history.filter(m => { return m.team_a_score != null }).sort((a,b) => {
    return b.round - a.round
  });
}

const selectColumns = (type) => {
  let base = [
    {
      Header: 'GW', //() => <i className="fas fa-hashtag"></i>,
      accessor: 'round',
      Cell: GWCell
    },
    {
      Header: () => <i className="far fa-clock"></i>,
      accessor: 'minutes'
    }
  ];

  switch (type) {
    case 1:
      base.push(
        { Header: 'S', accessor: 'saves' }, 
        { Header: 'CS', accessor: 'clean_sheets'}
      );
      break;
    case 2: 
      base.push(
        { Header: () => <i className="fas fa-crosshairs"></i>, accessor: 'goals_scored' }, 
        { Header: () => <i className="fas fa-hands-helping"></i>, accessor: 'assists'},
        { Header: 'CS', accessor: 'clean_sheets'}
      );
      break;
    default:
      base.push(
        { Header: () => <i className="fas fa-crosshairs"></i>, accessor: 'goals_scored' }, 
        { Header: () => <i className="fas fa-hands-helping"></i>, accessor: 'assists'}
      );
      break;
  }
  // Add points as last column
  base.push({
    Header: 'Pts',
    accessor: 'total_points'
  });

  return base;
}

const getSeasonStats = (fixtures) => {
  let stats = {
    goals_scored: 0,
    assists: 0,
    saves: 0,
    clean_sheets: 0,
    minutes: 0,
    total_points: 0,
    red_cards: 0,
    yellow_cards: 0,
  };
  if (!fixtures || !fixtures.history.length) return stats;
  
  return Object.values(fixtures.history).reduce((s, f) => {
    return Object.keys(s).reduce((n, k) => {
      n[k] = s[k] + f[k];
      return n;
    }, s);
  }, stats);
}

const renderOvrStats = (stats, type) => {
  let info = {
    goals: <div><b><i className="fas fa-crosshairs"></i> <small style={{ fontWeight: '700' }}>{stats.goals_scored}</small></b></div>,
    assists: <div><b><i className="fas fa-hands-helping"></i> <small style={{ fontWeight: '700' }}>{stats.assists}</small></b></div>,
    saves: <div><b><span style={{ fontSize: 'smaller' }}>S</span> <small style={{ fontWeight: '700' }}>{stats.saves}</small></b></div>,
    cleans: <div><b><span style={{ fontSize: 'smaller' }}>CS</span> <small style={{ fontWeight: '700' }}>{stats.clean_sheets}</small></b></div>,
  };

  switch (type) {
    case 1:
      return <>{info.saves}{info.cleans}</>;
    case 2:
      return <>{info.goals}{info.assists}{info.cleans}</>;
    case 3:
    case 4:
    default:
      return <>{info.goals}{info.assists}</>;
  }
}

/**
 * 
 * @param {Object} param0 
 */
export default function PlayerHistory({ fixtures, type }) {
  const sortedData = React.useMemo(() => sortData(fixtures), [fixtures]);
  // console.log(fixtures);
  const columns = React.useMemo(
    () => selectColumns(type), [type]
  )
  const latest_match = React.useMemo(() => fixtures.history[fixtures.history.length - 1], [fixtures]);
  const stats = React.useMemo(() => getSeasonStats(fixtures), [fixtures]);

  return (
    <div className="banner-player-history-wrapper">
      <Table columns={columns} data={sortedData} />
      <div className="player-history-stats">
        <div className="player-ovr-stats">
          <div>
            <b><i className="fas fa-pound-sign"></i> <small style={{ fontWeight: '700' }}>{latest_match.value/10}</small></b>
          </div>
          <div>
            <b><span>Pts</span> <small style={{ fontWeight: '700' }}>{stats.total_points}</small></b>
          </div>
        </div>
        <div className="player-ovr-stats">
          {renderOvrStats(stats, type)}
        </div>
      </div>
    </div>
  )
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useBlockLayout
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({ style })}
          className="pht-tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
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
    <div {...getTableProps()} className="pht">
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="pht-tr pht-header">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={99}
          itemCount={rows.length}
          itemSize={25}
          width={'100%'}
          className="gameweek-history-list"
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  )
}