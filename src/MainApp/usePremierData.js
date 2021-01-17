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
    console.log(player);
    // Unable to locate player
    /**
     * explain: [
     *  { fixture: Number, stats: [] }
     * ]
     */
    if (!player) return null;
    else if (player.explain.length && player.explain[0].stats) {
      return player.explain.map(f => {
        return f.stats.reduce((a, b) => {
          return a + b.points;
        }, 0);
      }).reduce((a, b) => a + b, 0);
    } else return null;
  }

  /**
   * Get live points of player on specific match.
   * @param {Number} id - Player Id 
   * @param {*} live 
   */
  function getPointsFromMatch(id, live, match_id) { 
    if (!live || !id || !match_id) return null;

    let player = live.elements.find(e => e.id === id);

    let match = player.explain.find(e => e.fixture === match_id);
    if (match && player.stats) {
      return match.stats.reduce((a, b) => {
        return a + b.points;
      }, 0);
    } else return null;
  }

  function getCardsFromMatch(id, match) {
    let cards = { yellow: 0, red: 0 };
    if (!match) return cards;
    // Check if match has started and has stats in it.
    if (match.started || !match.stats) return cards;
    let yellows = match.stats.find(s => s.identifier === 'yellow_cards');
  }

  function getMatchStats(match) {
    if (!match || !match.started || !match.stats) return null;
    let { a: ag, h: hg } = match.stats.find(s => s.identifier === 'goals_scored');
    let { a: aa, h: ha } = match.stats.find(s => s.identifier === 'assists');
    let { a: aog, h: hog } = match.stats.find(s => s.identifier === 'own_goals');
    let { a: aps, h: hps } = match.stats.find(s => s.identifier === 'penalties_saved');
    let { a: apm, h: hpm } = match.stats.find(s => s.identifier === 'penalties_missed');
    let { a: ayc, h: hyc } = match.stats.find(s => s.identifier === 'yellow_cards');
    let { a: arc, h: hrc } = match.stats.find(s => s.identifier === 'red_cards');
    let { a: as, h: hs } = match.stats.find(s => s.identifier === 'saves');

    let stats = {
      goals: ag.concat(hg),
      assists: aa.concat(ha),
      own_goals: aog.concat(hog),
      penalties_saved: aps.concat(hps),
      penalties_missed: apm.concat(hpm),
      yellow_cards: ayc.concat(hyc),
      red_cards: arc.concat(hrc),
      saves: as.concat(hs)
    };

    return stats;
  }

  /**
   * Gets players possible Bonus points, when match isn't even ended.
   * @param {Number} id - Players ID 
   * @param {Object} match 
   */
  function getPlayerBonusPoints(id, match) {
    // Player has no matches on the current gameweek.
    if (!match.gameweek) return null;
    let points = 0;
    // Looping every match player has on current gameweek
    match.gameweek.forEach(m => {
      // Check if match has started and has stats in it. Else leave loop.
      if (!m.started || !m.stats) return;
      // Checking Bonus Points System
      let bps = m.stats.find(s => s.identifier === "bps");
      // Adding both teams values to same array, and sorting it as ascending.
      let players = [...bps.a, ...bps.h].sort((a,b) => b.value - a.value);
      // Check if player is in the array, if not just return.
      if (!players.find(i => i.element === id)) return;

    /**
     * Top 3 only gets points.
     * 1st: 3 points,
     * 2nd: 2 points,
     * 3rd 1 point.
     * 
     * If 2 players are 1st, then 2nd gets 1 point.
     * If 2 players are 2nd, then no one gets 1 point.
     */
      let most_points = Math.max.apply(Math, players.map(o => o.value));
      let second_points = Math.max.apply(Math, players.map(o => o.value != most_points ? o.value : null ));
      let third_points = Math.max.apply(Math, players.map(o => o.value != most_points && o.value != second_points ? o.value : null ));

      let threepoints = players.filter(p => p.value === most_points );
      let twopoints = players.filter(p => p.value === second_points );
      let onepoints = players.filter(p => p.value === third_points );

      // Give points to top 3 players
      if (threepoints.find(i => i.element === id)) points += 3; 
      else if (twopoints.find(i => i.element === id)) {
        if (threepoints.length < 2) points += 2;      // 1 player was 1st, give 2 points
        else if (threepoints.length < 3) points += 1; // 2 players where 1st, give 1 point
      } else if (onepoints.find(i => i.element === id)) {
        // If under 3 players got points, give 1 point.
        if (threepoints.length + twopoints.length < 3) points += 1;
      }
    });
    return points;
  }

  /**
   * Calculates all needed information to players active roster.  
   * Returns object: { points, data }
   * @param {import('../PremierContext/premier').Pick[] } roster 
   * @param {import('../PremierContext/premier').Live } live
   * @param {Object} matches - Mathes of current gameweek 
   */
  function calculateRoster(roster, live, matches) {
    let data = [
      { name: 'Bench', css:'bench', type: 0, players: [], played: { value: 0, sum: 0, points: 0 } },
      { name: 'Goalkeeper', css:'role-bg1', type: 1, players: [], played: { value: 0, sum: 0, points: 0 } },
      { name: 'Defenders', css:'role-bg2', type: 2, players: [], played: { value: 0, sum: 0, points: 0 } },
      { name: 'Midfielders', css:'role-bg3', type: 3, players: [], played: { value: 0, sum: 0, points: 0 } },
      { name: 'Forwards', css:'role-bg4', type: 4, players: [], played: { value: 0, sum: 0, points: 0 } }
    ];

    for (let pick of roster) {
      let player = getPlayerByElement(pick.element);
      // Get the right array for the player. If multiplier === 0, player will be on bench.
      let datapath = data[pick.multiplier && player.element_type];
      /**
       * TODO: Needs a fix! 
       * If match played today, points won't containt possible bonus points!
       * - Issue: If player played today, it's bonus is calculated on the next day.
       * We could get bonus live, and add it to points. Works before API adds own bps tomorrow.
       * Then we need to remove bonus?
       */
      let games = matches.find(t => t.id === player.team);
      let points = getPointsFromLiveData(player.id, live);
      console.log(`Counting points ${player.web_name}`, points);
      let bonus = getPlayerBonusPoints(player.id, games);
      // console.log(player.web_name, 'has', player.event_points, 'points!',`(${points} + ${bonus})`);
      // Player has bonus points and they are added to event points.
      if (bonus && points === player.event_points) {

        // console.log(player.web_name, games);
        if (games.gameweek[0].finished && games.gameweek[0].finished_provisional) {
          // Remove bonus points from overall points.
          points = (points - bonus);
        } else {
          console.log(player.web_name, 'game not ended', games.gameweek[0]);
        }
      }
      // Add player to right array
      datapath.players.push({
        player,
        info: pick,
        points: {
          value: points * pick.multiplier,
          bonus: bonus * pick.multiplier
        }
      });
      // Update played values
      datapath.played.value += points ? player.now_cost : 0;
      datapath.played.sum += player.now_cost;
      datapath.played.points += bonus ? (bonus+points)*pick.multiplier : points * pick.multiplier;
    };
    /**
     * Literally really risky approach, as it won't count the first object of the array.
     * In this case it shouldn't matter, as the first object is bench, that should have 0 points.
     */
    let points = data.reduce((a, b ) => a + b.played.points, 0);

    return { points, data };
  }

  /**
   * Counts points for players of a specific game.
   * @param {Number[]} elements - List of player elements on current match.
   * @param {Object} live  - Live data
   * @param {import('../PremierContext/premier').Match} match - Match data
   */
  function calculateGame(elements, live, match) {
    let players = [];

    let stats = getMatchStats(match);

    for (let element of elements) {
      let player = getPlayerByElement(element);
      let points = getPointsFromMatch(player.id, live, match.id);
      let bonus = getPlayerBonusPoints(player.id, { gameweek: [match] });
      let cards = { yellow: [], red: []};

      if (stats) {
        cards.yellow = stats.yellow_cards.find(p => p.element === element);
        cards.red = stats.red_cards.find(p => p.element === element);
      }

      // Player gained bonus points
      if (bonus && points === player.event_points) {
        // Match is fully ended and points are calculated right to players, thus remove our own calculations.
        if (match.finished && match.finished_provisional) points = (points - bonus);
      }
      players.push({
        player,
        points: {
          value: points,
          bonus: bonus
        },
        cards: {
          yellow: cards.yellow ? cards.yellow.value : 0,
          red: cards.red ? cards.red.value : 0,
        },
        sort: points + bonus,
      });
    }
    // Sort players by points

    players.sort((a,b) => b.sort - a.sort);

    return players;
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

  /**
   * @typedef {Object} Standings
   * @property {import('../PremierContext/premier').LeagueStandings} data - The standings data 
   * @property {Boolean} loading - Is the request still pending 
   */
  /**
   * Get leagues standings
   * @param {Number} id - league Id 
   * @return {Standings}  The picks for the user.
   */
  const useLeagueStandings = (id) => {
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const fetchData = useCallback(async () => {
      try {
        let standings = await context.getLeagueStandings(id);
        setData(standings);
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
    getPlayerBonusPoints,
    listPlayers,
    calculateRoster,
    calculateGame,
    getElementInfo,
    fetchFixtures,
    useGetPick,
    useLiveData,
    useGetFixtures,
    useLeagueStandings
  }
}

export default usePremierData;