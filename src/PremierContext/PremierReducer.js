import { SET_SEASON, SET_TEAM, SET_ELEMENTS, SET_FIXTURES, SET_USER, SET_RECENT } from './types';

export default (state, action) => {
  const { payload, type } = action;

  /*
  season: null, //localStorage.getItem('season') ? JSON.parse(localStorage.getItem('season')) : null,
  team: null, // Saves current team info here
  defaultUser: localStorage.getItem('defaultTeam'),
  elements: null,
  fixtures: null,
  */
  switch (type) {
    case SET_SEASON:
      return {
        ...state,
        season: payload
      };
    case SET_TEAM:
      return {
        ...state,
        team: payload
      };
    case SET_ELEMENTS:
      return {
        ...state,
        elements: payload
      };
    case SET_FIXTURES:
      return {
        ...state,
        fixtures: payload
      };
    case SET_USER:
      return {
        ...state,
        defaultUser: payload
      };
    case SET_RECENT:
      return {
        ...state,
        recents: payload
      };
    default:
      return state;
  }
}