import { SET_SEASON, SET_TEAM, SET_ELEMENTS, SET_FIXTURES, SET_USER, SET_RECENT, SET_PAGE } from './types';

export default (state, action) => {
  const { payload, type } = action;

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
    case SET_PAGE:
      return {
        ...state,
        defaultPage: payload
      };
    default:
      return state;
  }
}