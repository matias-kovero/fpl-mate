import React, { useReducer, useEffect } from 'react';
import { SET_SEASON, SET_TEAM, SET_ELEMENTS, SET_FIXTURES, SET_USER, SET_RECENT, SET_PAGE } from './types';
import PremierContext from './PremierContext';
import PremierReducer from './PremierReducer';
import useAPIError from '../ApiErrorContext/useAPIError';

const API_BASE_URL = 'https://fpl-server.vercel.app/api';

const initialState = {
  season: null,
  team: null,
  defaultUser: localStorage.getItem('defaultUser'),
  defaultPage: localStorage.getItem('defaultPage'),
  recents: JSON.parse(localStorage.getItem('recentSearches') || "[]" ),
  elements: null,
  fixtures: null,
};

const PremierState = ({ children }) => {
  const { addError } = useAPIError();
  const [ state, dispatch ] = useReducer(PremierReducer, initialState);

  useEffect(() => {
    async function initialInfo() {
      await getSeasonInfo();
      await getFixtures();
    }
    initialInfo();
    if (state.defaultUser && state.defaultUser != 0) {
      console.log(state.defaultUser);
      searchProfile(state.defaultUser);
    }
  }, [ ]); // eslint-disable-line react-hooks/exhaustive-deps

  
  const getSeasonInfo = async() => {
    const endpoint = `${API_BASE_URL}/bootstrap-static/`;
    let res = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(res.status)) {
      let json = await res.json();
      dispatch({ type: SET_SEASON, payload: json });
      dispatch({ type: SET_ELEMENTS, payload: json.elemets });
      // Save local fallback
      localStorage.setItem('season', JSON.stringify(json));
      return json;
    } else {
      addError(`Failed to fetch season info - ${res.status}`);
      throw Error(`${res.status} - ${res.statusText}`);
    }
  }

  const getFixtures = async() => {
    const endpoint = `${API_BASE_URL}/fixtures/`;
    let res = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(res.status)) {
      let json = await res.json();
      dispatch({ type: SET_FIXTURES, payload: json });
      return json;
    } else {
      addError(`Failed to get fixtures -  ${res.status}`)
      throw Error(`${res.status} - ${res.statusText}`);
    }
  }

  const getRecentProfiles = () => {
    return JSON.parse(localStorage.getItem('recentSearches') || "[]" );
  }

  const addToRecentSearches = (search) => {
    let recents = getRecentProfiles();
    let previous = recents.findIndex(r => r.id === search.id);
    // Check if user is already found on recents.
    if (previous !== -1) {
      recents.splice(previous, 1);
      // Remove it from the array !! - Retarded aproach, pls hit me.
      // recent = recent.filter(r => r.id != search.id);
    }
    recents.unshift({ id: search.id, name: search.name, owner: search.owner });
    localStorage.setItem('recentSearches', JSON.stringify(recents));
    dispatch({ type: SET_RECENT, payload: recents });
  }

  const removeFromRecents = (id) => {
    let recents = getRecentProfiles();
    let idx = recents.findIndex(r => r.id === id);
    if (idx !== -1) recents.splice(idx, 1);
    localStorage.setItem('recentSearches', JSON.stringify(recents));
    dispatch({ type: SET_RECENT, payload: recents });
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
    } else if ([404].includes(res.status)) {
      addError('Team not found, please check Team ID', res.status);
    } else {
      addError(`${res.statusText} - ${res.status}`);
      //throw Error(`${res.status} - ${res.statusText}`);
    }
  }

  const clearProfile = () => {
    dispatch({ type: SET_TEAM, payload: null });
  }

  const setDefaultUser = (user) => {
    dispatch({ type: SET_USER, payload: user });
    localStorage.setItem('defaultUser', JSON.stringify(user));
    //return state.defaultUser;
  }

  const removeDefaultUser = () => {
    dispatch({ type: SET_USER, payload: 0 });
    localStorage.setItem('defaultUser', JSON.stringify(0));
  }

  const setDefaultPage = (page) => {
    dispatch({ type: SET_PAGE, payload: page });
    localStorage.setItem('defaultPage', page);
  }
  /**
   * Will get users squad of the specified gameweek.
   * @param {Number} id - Users Team ID 
   * @param {Number} gameweek - Gameweek we want to query 
   */
  const getSquad = async(id, gameweek) => {
    if (!id) return addError('Unable to find squad. Unkown team ID.');
    else if (!gameweek) return addError('Unable to get gameweek.');
    const endpoint = `${API_BASE_URL}/entry/${id}/event/${gameweek}/picks/`;
    let res = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(res.status)) {
      let json = await res.json();
      return json;
    } else {
      addError('Failed to fetch squad. Please try again later.');
    }
  }
  /**
   * Will get players information
   * @param {Number} id - Player ID 
   */
  const getPlayerInfo = async(id) => {
    if (!id) { 
      addError('Unable to get player ID.');
      return;
    }
    const endpoint = `${API_BASE_URL}/element-summary/${id}/`;
    let res = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(res.status)) {
      let json = await res.json();
      return json;
    } else {
      addError('Failed to fetch player information. Please try again later.');
      return;
    }
  }
  /**
   * Will query live stats of the specified gameweek.
   * @param {Number} gameweek - Gamewekk we want to query 
   */
  const getLiveStats = async(gameweek) => {
    if (!gameweek) {
      addError('Unable to get gameweek.');
      return;
    }
    const endpoint = `${API_BASE_URL}/event/${gameweek}/live/`;
    let res = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(res.status)) {
      let json = await res.json();
      return json;
    } else {
      addError('Failed to fetch live stats. Please try again later.');
    }
  }

  const getLeagueStandings = async(league_id) => {
    if (!league_id) {
      addError('Unable to get league information.');
      return;
    }
    const endpoint = `${API_BASE_URL}/leagues-classic/${league_id}/standings/`;
    let res = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(res.status)) {
      let json = await res.json();
      return json;
    } else {
      addError('Failed to fetch league information.');
    }
  }

  const updateLeagueStandings = async(league_id, page) => {
    if (!league_id || !page) {
      addError('Unable to fetch league standings');
      return;
    }
    const endpoint = `${API_BASE_URL}/leagues-classic/${league_id}/standings/?page_new_entries=1&page_standings=${page}`;
    let res = await fetch(endpoint, { method: 'GET' });
    if ([200].includes(res.status)) {
      let json = await res.json();
      return json;
    } else {
      addError('Failed to fetch league standings.');
    }
  }

  // Delete recent searched profiles, defaultProfile and defaultPage
  const clearCache = () => {
    // Delete default User
    removeDefaultUser();
    // Delete recent searches
    localStorage.setItem('recentSearches', JSON.stringify([]));
    dispatch({ type: SET_RECENT, payload: [] });
    // Delete defaultPage
    setDefaultPage('');
  }

  return (
    <PremierContext.Provider 
      value={{
        team: state.team,
        season: state.season,
        elements: state.elements,
        fixtures: state.fixtures,
        defaultUser: state.defaultUser,
        recentSearches: state.recents,
        defaultPage: state.defaultPage,
        searchProfile,
        clearProfile,
        setDefaultPage,
        getSquad,
        getPlayerInfo,
        getLiveStats,
        setDefaultUser,
        removeDefaultUser,
        removeFromRecents,
        getRecentSearches: getRecentProfiles,
        getLeagueStandings,
        updateLeagueStandings,
        clearCache,
        // These are old code -> SHOULD REMOVE THESE
        GetFixtures: forceUpdateFixtures,
        GetTeamInfo: searchProfile
      }}
    >
      {children}
    </PremierContext.Provider>
  )
}

export default PremierState;