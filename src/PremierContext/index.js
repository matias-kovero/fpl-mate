import PremierContext from './PremierContext';

export default PremierContext;


/*import React, { Component, useEffect, useReducer, useState } from 'react';
import { Cookies } from 'react-cookie';
import useAPIError from '../MainApp/useAPIError';
import PremierReducer from './PremierReducer';
import { SET_SEASON, SET_TEAM, SET_ELEMENTS, SET_FIXTURES } from './types';

let PremierContext = React.createContext();

const Cookie = new Cookies();

const API_BASE_URL = 'https://fpl-server.vercel.app/api';*/

// const { addError } = useAPIError();
/*
class PremierProvider extends Component {
  state = {
    season: null, //localStorage.getItem('season') ? JSON.parse(localStorage.getItem('season')) : null,
    team: Cookie.get('team') || null, // Saves current team info here
    defaultTeam: localStorage.getItem('defaultTeam'),
    league: localStorage.getItem('league') ? JSON.parse(localStorage.getItem('league')) : null,
    elements: null,
    fixtures: null,
  }
  
  componentDidMount() {
    // Check if cookies have teamId, update its info.
    if (!this.state.season) {
      // User has no season data! Fetch it and save it to localStorage!
      async function initInfo(cb) {
        await cb();
      }
      initInfo(this.GetSeasonInfo);
      initInfo(this.GetFixtures);
      if (this.state.defaultTeam) {
        this.GetTeamInfo(this.state.defaultTeam);
      }
    }
  }

  setDefaultTeam = (team) => {
    localStorage.setItem('defaultTeam', team);
  }

  setTeam = (team) => {
    this.setState(( prevstate) => ({ team }));
  }
  setSeason = (season) => {
    this.setState(( prevstate) => ({ season }));
  }
  setClassicLeague = (league) => {
    this.setState(( prevstate) => ({ league }));
  }
  setElements = (elements) => {
    this.setState((prevstate) => ({ elements }));
  }
  setFixtures = (fixtures) => {
    this.setState((prevstate) => ({ fixtures }));
  }

  searchProfile = async (id) => {
    if (!id) throw Error('Missing Team ID');
    const endpoint = `${API_BASE_URL}/entry/${id}/`;
    let res = await fetch(endpoint, { method: 'GET' });

    if ([200].includes(res.status)) {
      let json = await res.json();
      // Add user to current team
      this.setTeam(json);
      let user = {
        id: json.id,
        name: json.name,
        owner: `${json.player_first_name} ${json.player_last_name}`
      };
      this.addToRecentSearches(user);
      // Add profile to recent searches.
    } else if ([503].includes(res.status)) {
      let errTxt = await (await res.text()).replaceAll('"', '');
      this.setTeam({ err: errTxt });
    } else {
      addError(`${res.statusText} - ${res.status}`);
      //throw Error(`${res.status} - ${res.statusText}`);
    }
  }

  clearProfile = () => {
    this.setTeam(null);
  }

  getRecentSearches = () => {
    return JSON.parse(localStorage.getItem('recentSearches') || "[]" );
  }

  addToRecentSearches = (search) => {
    let recent = this.getRecentSearches();
    let previous = recent.findIndex(r => r.id === search.id);
    // Check if user is already found on recents.
    if (previous !== -1) {
      recent.splice(previous, 1);
      // Remove it from the array !! - Retarded aproach, pls hit me.
      // recent = recent.filter(r => r.id != search.id);
    }

    recent.unshift({ id: search.id, name: search.name, owner: search.owner });
    localStorage.setItem('recentSearches', JSON.stringify(recent));
  }

  GetTeamInfo = async (id) => {
    if (!id) throw Error('Missing Team ID!');
    //https://fantasy.premierleague.com/api/entry/1598128/
    const endpoint = `${API_BASE_URL}/entry/${id}/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      this.setTeam(json);
      return json;
    } else if([503].includes(result.status)) {
      let errorText = await (await result.text()).replaceAll('"','');
      console.log(`Context: ${errorText}`);
      this.setTeam({ err: errorText });
      return result;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetPlayerInfo = async (id) => {
    if (!id) throw Error('Missing Team ID!');
    //https://fantasy.premierleague.com/api/entry/1598128/
    const endpoint = `${API_BASE_URL}/entry/${id}/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetTransferInfo = async (id) => {
    if (!id) throw Error('Missing Team ID!');
    // https://fantasy.premierleague.com/api/entry/{team-id}/transfers-latest/
    const endpoint = `${API_BASE_URL}/entry/${id}/transfers-latest/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetLeagueInfo = async (id) => {
    if (!id) throw Error('Missing League ID!');
    // https://fantasy.premierleague.com/api/leagues-classic/179043/standings/
    const endpoint = `${API_BASE_URL}/leagues-classic/${id}/standings/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      this.setClassicLeague(json);
      localStorage.setItem('league', JSON.stringify(json));
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetSeasonInfo = async () => {
    // https://fantasy.premierleague.com/api/bootstrap-static/
    const endpoint = `${API_BASE_URL}/bootstrap-static/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      this.setSeason(json);
      this.setElements(json.elements);
      localStorage.setItem('season', JSON.stringify(json));
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetFixtures = async () => {
    // https://fantasy.premierleague.com/api/fixtures/
    const endpoint = `${API_BASE_URL}/fixtures/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      this.setFixtures(json);
      console.log(json);
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetChipUsage = async (id) => {
    if (!id) throw Error('Missing Player ID!');
    // https://fantasy.premierleague.com/api/entry/{playerId}/history/
    const endpoint = `${API_BASE_URL}/entry/${id}/history/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetPicks = async (id, gameweek) => {
    if (!id) throw Error('Missing Player ID!');
    else if (!gameweek) throw Error('Missing Gameweek!');
    // https://fantasy.premierleague.com/api/entry/{id}/event/{gw}/picks/
    const endpoint = `${API_BASE_URL}/entry/${id}/event/${gameweek}/picks/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetElementInfo = async (id) => {
    if (!id) throw Error('Missing Element ID!');
    // https://fantasy.premierleague.com/api/element-summary/181/
    const endpoint = `${API_BASE_URL}/element-summary/${id}/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetLiveInfo = async (gameweek) => {
    if (!gameweek) throw Error('Missing gameweek');
    // https://fantasy.premierleague.com/api/event/11/live/
    const endpoint = `${API_BASE_URL}/event/${gameweek}/live/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  GetLeagueStandings = async (league_id, page) => {
    if (!league_id || !page) throw Error('Missing either league id or page number!');
    // https://fantasy.premierleague.com/api/leagues-classic/314/standings/?page_new_entries=1&page_standings=2&phase=1
    const endpoint = `${API_BASE_URL}/leagues-classic/${league_id}/standings/?page_new_entries=1&page_standings=${page}&phase=1`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  render() {
    const { children } = this.props
    const { team_id, team, league, elements, season, fixtures } = this.state
    const { GetTeamInfo, GetLeagueInfo, GetPicks, GetPlayerInfo, GetElementInfo, GetLiveInfo, GetFixtures } = this
    const state = this.state
    
    // Update current profile
    const { searchProfile, clearProfile, getRecentSearches } = this

    return (
      <PremierContext.Provider
        value={{
          team_id, state,
          GetTeamInfo, GetLeagueInfo, GetPicks, GetPlayerInfo, GetElementInfo, GetLiveInfo, GetFixtures,
          team, league, elements, season, fixtures,
          searchProfile, clearProfile, getRecentSearches
        }}
      >
        {children}
      </PremierContext.Provider>
    )
  }
}
export default PremierContext
export { PremierProvider }*/
/*
const initialState = {
  season: null, //localStorage.getItem('season') ? JSON.parse(localStorage.getItem('season')) : null,
  team: null, // Saves current team info here
  defaultTeam: localStorage.getItem('defaultTeam'),
  elements: null,
  fixtures: null,
}

const PremierProvider = (props) => {
  const { addError } = useAPIError();
  const [ state, dispatch ] = useReducer(PremierReducer, initialState);

  useEffect(() => {
    async function initialInfo(cb) {
      await cb();
    }
    initialInfo(getSeasonInfo);
    initialInfo(getFixtures);
  }, []);
  
  const getSeasonInfo = async() => {
    const endpoint = `${API_BASE_URL}/bootstrap-static/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      dispatch({ type: SET_SEASON, payload: json });
      dispatch({ type: SET_ELEMENTS, payload: json.elemets });
      localStorage.setItem('season', JSON.stringify(json));
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  const getFixtures = async() => {
    const endpoint = `${API_BASE_URL}/fixtures/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      dispatch({ type: SET_FIXTURES, payload: json });
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  const getRecentProfiles = () => {
    return JSON.parse(localStorage.getItem('recentSearches') || "[]" );
  }

  const addToRecentSearches = (search) => {
    let recent = getRecentProfiles();
    let previous = recent.findIndex(r => r.id === search.id);
    // Check if user is already found on recents.
    if (previous !== -1) {
      recent.splice(previous, 1);
      // Remove it from the array !! - Retarded aproach, pls hit me.
      // recent = recent.filter(r => r.id != search.id);
    }
    recent.unshift({ id: search.id, name: search.name, owner: search.owner });
    localStorage.setItem('recentSearches', JSON.stringify(recent));
  }

  const forceUpdateFixtures = async() => {
    const endpoint = `${API_BASE_URL}/fixtures/`;
    let result = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(result.status)) {
      let json = await result.json();
      return json;
    } else {
      throw Error(`${result.status} - ${result.statusText}`);
    }
  }

  const searchProfile = async (id) => {
    if (!id) throw Error('Missing Team ID');
    const endpoint = `${API_BASE_URL}/entry/${id}/`;
    let res = await fetch(endpoint, { method: 'GET' });

    if ([200].includes(res.status)) {
      let json = await res.json();
      // Add user to current team
      dispatch({ type: SET_TEAM, payload: json });
      let user = {
        id: json.id,
        name: json.name,
        owner: `${json.player_first_name} ${json.player_last_name}`
      };
      addToRecentSearches(user);
      // Add profile to recent searches.
    } else if ([503].includes(res.status)) {
      let errTxt = await (await res.text()).replaceAll('"', '');
      dispatch({ type: SET_TEAM, payload: { err: errTxt } });
      //this.setTeam({ err: errTxt });
    } else {
      addError(`${res.statusText} - ${res.status}`);
      //throw Error(`${res.status} - ${res.statusText}`);
    }
  }

  const clearProfile = () => {
    dispatch({ type: SET_TEAM, payload: null });
  }

  return (
    <PremierContext.Provider 
      value={{
        team: state.team,
        season: state.season,
        elements: state.elements,
        fixtures: state.fixtures,
        //searchProfile,
        getRecentSearches: getRecentProfiles,
        // These are old code -> SHOULD REMOVE THESE
        GetFixtures: forceUpdateFixtures,
        searchProfile
      }}
    >
      {props.children}
    </PremierContext.Provider>
  )
}

export default PremierContext
export { PremierProvider }*/