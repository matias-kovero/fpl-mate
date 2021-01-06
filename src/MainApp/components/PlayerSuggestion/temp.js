import React, { useCallback, useEffect, useState, useFixture } from 'react';
import Datatable from 'react-bs-datatable';

import Fixtures from '../PlayerFixtures';

import {
  Pagination,
  PaginationOpts,
  TableHeader,
  TableBody,
  Filter,
  useDatatableLifecycle,
  shouldTableUpdate
} from 'react-bs-datatable';
import { makeClasses } from 'react-bs-datatable/lib/helpers/object';
import usePremierData from '../../usePremierData';

const customLabels = {
  first: '<<',
  last: '>>',
  prev: '<',
  next: '>',
  noResults: 'Whoops, something when wrong.'
};

const classes = {
  //paginationCol: 'player-suggestion-pagination',
  table: 'element-suggestion-table',
  theadRow: 'element-table-heading',
  theadCol: 'element-table-heading-col',
  tbodyRow: 'element-table-row',
  tbodyCol: 'element-table-col',
  controlRow: 'element-table-control',
  paginationCol: 'element-table-pagination',
  paginationButton: 'element-table-button'
};

const CustomTable = React.memo(props => {
  const {
    data,
    rowsPerPageOption,
    tableHeaders,
    onChangeFilter,
    onPageNavigate,
    classes,
    onRowsPerPageChange,
    onSortChange,
    tableClass,
    labels,
    filterable,
    filterText,
    rowsPerPage,
    currentPage,
    sortedProp,
    maxPage,
    Components
  } = useDatatableLifecycle(props);

  return (
    <>
      <Components.Row className="controlRow__root">
        <Components.Col xs="12">
          <Filter
            classes={classes}
            tableHeaders={tableHeaders}
            placeholder={labels.filterPlaceholder}
            onChangeFilter={onChangeFilter}
            filterText={filterText}
            filterable={filterable}
            components={{
              Adornment: Components.Adornment,
              Button: Components.Button,
              ClearIcon: Components.ClearIcon,
              FormControl: Components.FormControl,
              InputGroup: Components.InputGroup
            }}
          />
        </Components.Col>
      </Components.Row>
      <Components.Row>
        <Components.Col xs="12">
          <Components.Table className={tableClass}>
            <TableHeader
              classes={classes}
              tableHeaders={tableHeaders}
              sortedProp={sortedProp}
              onSortChange={onSortChange}
              components={{
                TableHead: Components.TableHead,
                TableCell: Components.TableCell,
                TableRow: Components.TableRow
              }}
            />
            <TableBody
              classes={classes}
              tableHeaders={tableHeaders}
              labels={labels}
              data={data}
              components={{
                TableBody: Components.TableBody,
                TableCell: Components.TableCell,
                TableRow: Components.TableRow
              }}
            />
          </Components.Table>
        </Components.Col>
      </Components.Row>
      <Components.Row className="controlRow__root bottom">
        <Components.Col xs={12} md={4} />
        <Components.Col xs={12} md={4}>
          <PaginationOpts
            classes={classes}
            labels={labels}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOption={rowsPerPageOption}
            components={{
              Form: Components.Form,
              FormGroup: Components.FormGroup,
              FormControl: Components.FormControl
            }}
          />
        </Components.Col>
        <Components.Col xs={12} md={4} className="text-right element-table-pagination">
          <Pagination
            classes={classes}
            data={data}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageNavigate={onPageNavigate}
            labels={labels}
            maxPage={maxPage}
            components={{
              Button: Components.Button,
              ButtonGroup: Components.ButtonGroup
            }}
          />
        </Components.Col>
      </Components.Row>
    </>
  );
}, shouldTableUpdate);

const tableHeaders = [
  { prop: 'total_points', title: 'Points', sortable: true,
    headerCell: (icon, sortedProp) => {
      // icon is the actual icon.
      // sortedProp is the currently sortedProp
      return (
        <>
          {`P`}
          <span className="element-list-status"><small>{icon}</small></span>
        </>
      )
    }
  },
  { prop: 'short_name', title: 'Team', cell: row => {
    return <TeamColumn player={row} />
  }, sortable: true },
  { prop: 'web_name', title: 'Player', cell: row => {
    return (
      <PlayerColumn player={row} />
    )
  }, sortable: true },
  { prop: 'now_cost', title: '£', cell: row => row.now_cost/10, sortable: true },
  { prop: 'ict_index_rank', title: 'ICT', sortable: true },
  { prop: 'ppm', title: 'PPM', sortable: true }
];

//const { getTeamById } = usePremierData();

const onSortFunction = {
  total_points(value) {
    return value;
  },
  team: (value) => {
    return value;
  },
  web_name: (value) => {
    // Basic sort will check for upper & lowerCase
    return value.toUpperCase();
  },
  ict_index_rank(value) {
    return parseFloat(value);
  },
  ppm(value) {
    return value;
  }
}

/**
 * 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').Element} props.current - Current player 
 */
export default function SuggestionTable({ current }) {
  const { listPlayers, getTeamById } = usePremierData();
  const [ list, setList ] = useState([]);

  useEffect(() => {
    if (current && current.element_type) {
      let player_list = listPlayers(current.element_type);
      // Enrich information to the elements.
      // For sorting purposes, get team short_name
      let enriched = player_list.map(p => { return {
        ...p, 
        short_name: getTeamById(p.team).short_name,
        ppm: Math.round(p.total_points / (p.now_cost/10) * 100) / 100
      } });
      // Datatable starting sort is wack, fix it here.
      enriched.sort((a,b) => b.total_points - a.total_points);
      setList(enriched);
      console.log(enriched);
    };
    return () => setList([]);
  }, [ current ]);

  return (
    <CustomTable 
      tableHeaders={tableHeaders} 
      tableBody={list}
      rowsPerPage={5}
      //initialSort={{ prop: 'ict_index', isAscending: false }} 
      onSort={onSortFunction} 
      labels={customLabels}
      classes={classes}
      Components={{
        ButtonGroup(props) {
          let child = props.children.find(c => c.key.includes("page-btn") && c.props.disabled );
          let pageNum = child ? child.props.pageNumber : 0;
          return (
            <>
            <div
              {...props}
              className={makeClasses(props.className, classes.buttonGroup)}
            />
            <span><small>{pageNum <= 1 ? '1' : (pageNum-1)*5+1} - {pageNum*5 > list.length ? list.length : pageNum*5}/{list.length}</small></span>
            </>
          );
        },
        Button(props) {
          let hidden = !['>','<'].includes(props.children);
          if (hidden) return null;
          return (
            <button {...props} className={makeClasses(hidden, props.className, classes.paginationButton)}>
              <i className={`fas fa-angle-${['<'].includes(props.children) ? 'left': 'right'}`}></i>
            </button>
          );
        }
      }}
    />
  )
}

const TeamColumn = ({ player }) => {
  const { getTeamShirt } = usePremierData();
  const shirt = getTeamShirt(player);

  return (
    <div className="element-cell">
      <div className="element-styled-media">
        <div className="element-media-img">
          <picture>
            <source></source>
            <img 
              alt={'?'}
              className="element-media-shirt" 
              src={`${shirt}-66.png`} 
              srcSet={`${shirt}-66.png 66w, ${shirt}-110.png 110w, ${shirt}-220.png 220w`}
              sizes="24px"
            ></img>
          </picture>
        </div>
      </div>
    </div>
  )
}

const PlayerColumn = ({ player, current }) => {
  const { useGetFixtures } = usePremierData();
  const [ fixtures, setFixtures ] = useState(null);
  const { data, loading } = useGetFixtures(player.id);

  // Set player fixtures
  useEffect(() => {
    if (data) {
      setFixtures(data);
    }
    return () => {
      setFixtures(null);
    }
  }, [data]);

  return (
    <div className="element-cell">
      <div className="element-styled-media">
        <div className="element-media-body">
          <div className="element-body-name">{player.web_name}</div>
          <div className="element-body-info">
            <Fixtures data={fixtures} amount={5} mini />
          </div>
        </div>
      </div>
    </div>
  )
}

function Suggestion({ player, current }) {
  const { getTeamById, getTeamShirt } = usePremierData();
  const [ fixtures, setFixtures ] = useState(null);
  const team = getTeamById(player.team);
  const shirt = getTeamShirt(player);
  const { data, loading } = useFixture(player);

  // Set player fixtures
  useEffect(() => {
    if (data) {
      setFixtures(data);
    }
    return () => {
      setFixtures(null);
    }
  }, [data]);

  return (
    <tr className="element-suggestion-row">
      <td className="element-cell-stats">{player.total_points}</td>
      <td className="element-cell">
        <div className="element-styled-media">
          <div className="element-media-img">
            <picture>
              <source></source>
              <img 
                alt={team.name}
                className="element-media-shirt" 
                src={`${shirt}-66.png`} 
                srcSet={`${shirt}-66.png 66w, ${shirt}-110.png 110w, ${shirt}-220.png 220w`}
                sizes="24px"
              ></img>
            </picture>
          </div>
          <div className="element-media-body">
            <div className="element-body-name">{player.web_name}</div>
            <div className="element-body-info">
              <Fixtures data={fixtures} amount={5} mini />
            </div>
          </div>
        </div>
      </td>
      <td className="element-cell-stats">{player.now_cost/10} <small>( {(player.now_cost - current.now_cost)/10} )</small></td>
      <td className="element-cell-stats">{Math.round(player.total_points / (player.now_cost/10) * 100) / 100}</td>
      {/*<small>{player.web_name}</small> | <small>PPG: {player.points_per_game}</small> | <small>Value: {player.now_cost/10}</small> | <small>PPM: {Math.round(player.total_points / (player.now_cost/10) * 100) / 100}</small> | <small>Points: {player.total_points}</small>*/}
    </tr>
  )
}