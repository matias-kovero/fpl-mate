import { useContext, useState, useCallback, useEffect } from 'react';
import PremierContext from '../PremierContext';

// https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react
const usePremierData = () => {
  const context = useContext(PremierContext);

  /**
   * @returns {import('../PremierContext/premier').Event} Gameweek Object
   */
  function getGameweek(id) {
    let gameweek = context.season.events.find(e => e.id === id);
    // Additional info to elements
    gameweek.is_first = gameweek.id === 1;
    gameweek.is_last = gameweek.id >= context.season.events.length;
    return gameweek;
  }

  /**
   * @returns {import('../PremierContext/premier').Event} Gameweek Object
   */
  function getCurrentGameweek() {
    return context.season.events.find(e => e.is_current);
  }

  /**
   * Get all the matches from the given gameweek.
   * @param {Number} gameweek - The mathes of this gameweek
   * @returns {import('../PremierContext/premier').Match[]}
   */
  function getMatches(gameweek) {
    return context.fixtures.filter(f => f.event === gameweek);
  }
  /**
   * Get basic information from given team.
   * @param {Number} id - Team Id 
   * @returns {import('../PremierContext/premier').Team} Team Object
   */
  function getTeamById(id) {
    return context.season.teams.find(t => t.id === id);
  }

  /**
   * Get players basic information of given element Id
   * @param {Number} id - Player element Id 
   * @returns {import('../PremierContext/premier').Element}
   */
  function getPlayerByElement(id) {
    return context.season.elements.find(p => p.id === id)
  }

  /**
   * Get elements label to display to the user
   * @param {String} name - Element name 
   * @returns {String} Element label
   */
  function getElementLabel(name) {
    return context.season.element_stats.find(e => e.name === name).label;
  }
  /**
   * Returns teams badge base image url.  
   * **You need to add '_size.png' to the end!**
   * *Example: _40.png*
   * @param {import('../PremierContext/premier').Team} team 
   */
  function getTeamBadge (team) {
    if (!team.code) team.code = 0;
    return `https://fpl-server.vercel.app/dist/img/badges/badge_${team.code}`;
  }

  /**
   * Get players shirt. Check if player has role specific shirt.
   * @param {import('../PremierContext/premier').Element} player 
   * @return {String} BaseURL of players shirt, remember to add *-width.png* to the end.  
   * Ex. -66.png *Widths:* **66, 110, 220**
   */
  function getTeamShirt (player) {
    if (!player || !player.team_code) return '';
    let type = context.season.element_types.find(e => e.id === player.element_type);
    return `https://fpl-server.vercel.app/dist/img/shirts/standard/shirt_${player.team_code}${type.ui_shirt_specific ? `_${player.element_type}`: ''}`;
  }

  /**
   * Return users favourite teams shirt.
   * @param {import('../PremierContext/premier').EntryObject } user
   * @returns {String} 
   */
  function getFavouriteShirt (user) {
    if (!user.favourite_team) return '';
    let team_code = context.season.teams.find(e => e.id === user.favourite_team).code;
    return `https://fpl-server.vercel.app/dist/img/shirts/standard/shirt_${team_code}-220.png`;
  }

  /**
   * Return players picture aka. Mugshot.
   * @param {Number} code 
   */
  function getPlayerPicture (code) {
    if (!code) return '';
    // https://fpl-server.vercel.app/photos/players/110x140/pXXXXXXX.png
    return `https://resources.premierleague.com/premierleague/photos/players/110x140/p${code}.png`;
  }

  /**
   * Get Premier element_type
   * @param {Number} element_type 
   * @returns {import('../PremierContext/premier').ElementType}
   */
  function getRole(element_type) {
    return context.season.element_types.find(e => e.id === element_type);
  }

  /**
   * Get all players that are the type requested
   * @param {Number} type player type
   * @returns {import('../PremierContext/premier').Element[]} Array of players
   */
  function listPlayers(type) {
    return context.season.elements.filter(e => e.element_type === type);
  }

  /**
   * Check players points from live data. 
   * @param {Number} id 
   * @param {*} live 
   */
  function getPointsFromLiveData(id, live) {
    // No live data provided
    if (!live) return null;
    let player = live.elements.find(e => e.id === id);
    // Unable to locate player
    if (!player) return null;
    
    else if (player.explain.length && player.explain[0].stats) {
      return player.explain[0].stats.reduce((a, b) => {
        return a + b.points;
      }, 0);
    } else return null;
  }

  /** CONTEXT ASYNC FUNCTIONS */

  async function getElementInfo(id) {
    return await context.getPlayerInfo(id);
  }

  async function fetchFixtures() {
    return await context.GetFixtures();
  }

  /**
   * @typedef {Object} Roster
   * @property {import('../PremierContext/premier').GameweekRoster} data - The users picks 
   * @property {Boolean} loading - Is the request still pending 
   */
  /**
   * Gets users picks for the given gameweek.
   * @param {Number} id - Users ID 
   * @param {Number} gw - Gameweek
   * @return {Roster}  The picks for the user.
   */
  const useGetPick = (id, gw) => {
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const fetchData = useCallback(async () => {
      try {
        let picks = await context.getSquad(id, gw);
        setData(picks);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }, [ id, gw ]);
    useEffect(() => {
      fetchData();
    }, [ fetchData ]);
    return { data, loading };
  }

    /**
   * @typedef {Object} LiveData
   * @property {import('../PremierContext/premier').Live} data - The users picks 
   * @property {Boolean} loading - Is the request still pending 
   */
  /**
   * Gets live data of given gameweek.
   * @param {Number} gw - Gameweek
   * @return {LiveData}  Live Data.
   */
  const useLiveData = (gw) => {
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const fetchData = useCallback(async () => {
      try {
        let live = await context.getLiveStats(gw);
        setData(live);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }, [ gw ]);
    useEffect(() => {
      fetchData();
    }, [ fetchData ]);
    return { data, loading };
  }

  /**
   * @typedef {Object} Roster
   * @property {import('../PremierContext/premier').GameweekRoster} data - The users picks 
   * @property {Boolean} loading - Is the request still pending 
   */
  /**
   * Gets users picks for the given gameweek.
   * @param {Number} id - Users ID 
   * @return {Roster}  The picks for the user.
   */
  const useGetFixtures = (id) => {
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const fetchData = useCallback(async () => {
      try {
        let fixtures = await context.getPlayerInfo(id);
        setData(fixtures);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }, [ id ]);
    useEffect(() => {
      fetchData();
    }, [ fetchData ]);
    return { data, loading };
  }

  return {
    currentGameweek: getCurrentGameweek(),
    matches: getMatches,
    getGameweek,
    getTeamById,
    getPlayerByElement,
    getElementLabel,
    getTeamBadge,
    getTeamShirt,
    getFavouriteShirt,
    getPlayerPicture,
    getRole,
    getPointsFromLiveData,
    listPlayers,
    getElementInfo,
    fetchFixtures,
    useGetPick,
    useLiveData,
    useGetFixtures
  }
}

export default usePremierData;