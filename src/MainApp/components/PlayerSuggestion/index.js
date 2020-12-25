import React, { useCallback, useEffect, useState } from 'react';
import { Tab, Badge, Nav, Pagination } from 'react-bootstrap';
import Fixtures from '../PlayerFixtures';

import usePremierData from '../../usePremierData';
const FILTER_RANGE = 0.5; // value in millions

const initialFilters = [
  { name: "value", label: "Value", field: "now_cost", data: [], asc: false, scale: true },
  { name: "ppg", label: "PPG", field: "points_per_game", data: [], asc: false, scale: true },
  { name: "ict", label: "ICT", field: "ict_index_rank", data: [], asc: true, scale: true },
  //{ name: "form", label: "Form", field: "value_form", data: [], asc: false },
  { name: "season", label: "Budget", field: "value_season", data: [], asc: false, scale: true },
  //{ name: "ppv", label: "PPV", field: "value_season", data: [], asc: false, func: ppv}
];
const fillData = (arr) => {
  initialFilters.forEach(f => {
    f.data = [...arr].sort((a, b) => {
      if (f.func) {
        return f.asc ? f.func(a) - f.func(b) : f.func(b) - f.func(a)
      } else return f.asc ? a[f.field] - b[f.field] : b[f.field] - a[f.field]
    });
    // Custom edits on data arrays
    if (f.name === "ppg") { 
      // Remove entries that have under 5 games played.
      // Better would be to compare players on the team and check played minutes
      f.data.filter(d => d.minutes > 200);
    }
  });
  return initialFilters;
}
/**
 * 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').Element} props.current - Currently selected player 
 */
export default function SuggestionContainer({ current }) {
  const { listPlayers } = usePremierData();
  const [ list, setList ] = useState(listPlayers(current.element_type));
  const [ filtered, setFiltered] = useState([]);
  const [ filter, setFilter ] = useState(0);
  const [ filters, setFilters] = useState(initialFilters);
  /** PAGINATION */
  const [ active, setActive ] = useState(1);
  let items = [];

  const changePage = (number) => {
    setActive(number);
  }

  for (let number = 1; number <=5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active} onClick={() => changePage(number)}>
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    console.log(`Creating suggestions for ${current.web_name}`);
    let player_list = listPlayers(current.element_type);
    setFilters(fillData(player_list));
    // Naive sort, getting the expensives
    // player_list.sort((a,b) => b.now_cost - a.now_cost);
    // player_list.sort((a,b) => b.points_per_game - a.points_per_game);
    setList(player_list);
    return () => {
      setList(null);
    }
  }, [ current ]);

  // When filter is changed, edit list
  useEffect(() => {
    let newList = list;
    newList.sort((a, b) => b[filters[filter].field] - a[filters[filter].field]);
    setFiltered(newList);
    return () => {
      setFiltered(null);
    }
  }, [ filter ]);

  useEffect(() => {
    console.log('useEffect on number change!');
  }, [ active ]);

  const changeFilter = (num) => {
    setFilter(num);
  }
  // If we have a null props, don't render!
  if (!current || !list) return null;

  return (
    <div className="suggestion-wrapper">
      <Tab.Container id="suggestion-tabs" defaultActiveKey={initialFilters[0].name}>
        <Nav className="nav-tabs">
          {filters.map((f, i) => {
            return (
              <Nav.Item key={i}>
                <Nav.Link eventKey={f.name}>{f.label}</Nav.Link>
              </Nav.Item>
            )
          })}
        </Nav>
        <Tab.Content>
          { filters.map((f, i) => {
            
            let arr = f.scale ? f.data.filter(p => {
              //Math.abs(p.now_cost-current.now_cost) < 10 
              return ((current.now_cost - p.now_cost) > (FILTER_RANGE*10) || (p.now_cost - current.now_cost) < (FILTER_RANGE*10))
            }).slice(((active-1)*5), (active*5)) : f.data.slice(0, 10);
            return (
              <Tab.Pane eventKey={f.name} key={i}>
                <div className="suggestions-container">
                  <table className="element-suggestion-table">
                    <thead>
                      <tr>
                        <th className="element-list-status">Points</th>
                        <th className="element-list-element">Player</th>
                        <th className="element-list-price">£</th>
                        <th className="element-list-stat">PPM</th>
                      </tr>
                    </thead>
                    <tbody>
                    { arr.map((p, i) => { 
                      return <Suggestion key={i} player={p} current={current} />
                    }) }
                    </tbody>
                  </table>
                </div>
                <div className="pagination-container">
                  <Pagination>{items}</Pagination>
                </div>
              </Tab.Pane>
            )
          })}
        </Tab.Content>
      </Tab.Container>
      <p>Players found: {filtered.length}</p>
      {/* LIST SUGGESTIONS */}
    </div>
  )
}

const useFixture = ( player ) => {
  const { getElementInfo } = usePremierData();
  const [ data, setData ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let fixtures = await getElementInfo(player.id);
      setData(fixtures);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [player]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading };
}

/**
 * 
 * @param {Object} props
 * @param {import('../../../PremierContext/premier').Element} props.player - Suggested player 
 * @param {import('../../../PremierContext/premier').Element} props.current - Current player 
 */
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