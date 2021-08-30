import { writable, get, derived } from "svelte/store";
import { unplayedMatches } from './utils';
import * as api from './api';

const development = true;

function devFetch(url, key, resolve) {
  if (localStorage.getItem(key)) {
    resolve(JSON.parse(localStorage.getItem(key)));
  } else {
    api.get(url).then(d => {
      localStorage.setItem(key, JSON.stringify(d));
      resolve(d);
    });
  }
  return JSON.parse(localStorage.getItem(key));
}
/**
 * https://svelte-recipes.netlify.app/components/
 */
export const count = writable(0);
export const isFetching = writable(false);

export function getNewCount() {
  isFetching.set(true);
  return new Promise((res) => {
    setTimeout(() => {
      res(count.set(Math.random()));
      isFetching.set(false);
    }, 1500)
  });
}

const handlerStash = writable({});
const live = writable({});

class FixtureHandler {
  constructor() {
    this.stash = handlerStash; //[];//handlerStash;
    this.live = live;
  }
  _initialLoad(id) {
    console.log('[Fixture] Loading GW', id, 'as default');
    this._fetch(id);
    // Just fill array with current gameweek fixtures.
  }
  _fetch(id) {
    //console.log('[Fixture] Store Arr:', this.stash);
    let gw = get(this.stash)[id];
    if (gw) return gw;
    // Check if gw is still active ? if so - fetch live
    return api.get(`api/fixtures/?event=${id}`).then((d) => {
      this.stash.update((state) => {
        state[id] = d;
        return state;
      });
      console.log('[Fixture] GW:', id, 'has unplayed matches:', unplayedMatches(d));
      if (unplayedMatches(d)) this._live(id);
      return d;
    });
    return new Promise((res) => {
      api.get(`api/fixtures/?event=${id}`, null, true).then((d) => {
        console.log(`[${id}]`, d);
        res(d);
      });
    })
  }
  _live(id) {
    let gw = get(this.live)[id];
    // Promise swap - return stale - create updated fetch?
    if (gw) return this.live;

    // Check if given gw has an need to display live data.
    if (unplayedMatches(this._fetch(id))) {
      console.log('[Fixture] GW:', id, 'has unplayed matches!');
    }
    // This will return an promise - is it what we want?
    api.get(`api/event/${id}/live/`).then((d) => {
      this.live.update((state) => {
        state[id] = d;
        return state;
      });
      //res(d);
      return this.live;
    });
    return this.live;
    return new Promise((res) => {
      api.get(`api/event/${id}/live/`).then((d) => {
        this.live.update((state) => {
          state[id] = d;
          return state;
        });
        res(d);
        return d;
      });
    });
    return api.get(`api/event/${id}/live/`).then((d) => {
      this.live.update((state) => {
        // Every request here should already have content in stash, update if with live data.
        state[id] = d;
        return state;
      });
      return d;
    });
  }
}

export const element_stats = writable([]);
export const element_types = writable([]);
export const elements = writable([]);
export const events = writable([]);
export const game_settings = writable({});
export const phases = writable({});
export const teams = writable([]);
export const total_players = writable(0);

export function getFantasyData() {
  return new Promise((res) => {
    if (development) {
      devFetch('api/bootstrap-static/', 'dev-bootstrap-static', (d) => {
        console.log(d);
        element_stats.set(d.element_stats);
        element_types.set(d.element_types);
        elements.set(d.elements);
        events.set(d.events);
        game_settings.set(d.game_settings);
        phases.set(d.phases);
        teams.set(d.teams);
        total_players.set(d.total_players);
        res(d);
      });
    } else {
      api.get('api/bootstrap-static/').then((d) => {
        // Update individual stores
        console.log('[Fantasy] Data:', d);
        element_stats.set(d.element_stats);
        element_types.set(d.element_types);
        elements.set(d.elements);
        events.set(d.events);
        game_settings.set(d.game_settings);
        phases.set(d.phases);
        teams.set(d.teams);
        total_players.set(d.total_players);
        // Resolve
        res(d);
      });
    }
  })
}

export function getUserData(id) {
  return new Promise((res) => {
    if (development) {
      devFetch(`api/entry/${id}/`, 'dev-user-data', res);
      // Handle errors here.. Ex. 503 "The game is being updated".
    } else {
      api.get(`api/entry/${id}/`, null, true).then((d) => {
        console.log(`[${id}] User:`, d);
        res(d);
      });
    }
  })
}

export function getUserPicks(id, gw) {
  return new Promise((res) => {
    if (development) {
      devFetch(`api/entry/${id}/event/${gw}/picks/`, `dev-user-picks-${gw}`, res);
    } else {
      api.get(`api/entry/${id}/event/${gw}/picks/`, null, true).then((d) => {
        console.log(`[${id}] GW (${gw}):`, d);
        res(d);
      });
    }
  })
}

export class FantasyWrapper {

  constructor() {
    console.log('[Fanstasy] Create');
    this.loading = true;
    // Initialize data
    getFantasyData().then(() => {
      console.log('[Fanstasy] Ready');
      // this._fixture._initialLoad(this.current_gameweek.id);
    });
    //getFantasyData();

    this._element_stats = element_stats;
    this._element_types = element_types;
    this._elements = elements;
    this._events = events;
    this._game_settings = game_settings;
    this._phases = phases;
    this._teams = teams;
    this._total_players = total_players;
    this._fixture = new FixtureHandler(); // <== If unknown id - get data.
  }
  /**
   * `$: totPlayers = fantasy.total_players;`  
   * `{$totPlayers}` <-- updated live
   */
  get total_players() {
    return derived(total_players, $total_players => $total_players);
  }
  /**
   * @returns {Object} Current gameweek object
   */
  get current_gameweek() {
    let gw = get(events).find(e => e.is_current);
    return gw;
  }
  /**
   * Get fixture information
   * @param {number} id gameweek id 
   * @returns 
   */
  fixture(id) {
    return this._fixture._fetch(id);
  }
}

export const fantasy = new FantasyWrapper();


/**
 * Basic Getter for fantasy data
 */

/**
 * Get element information.
 */
export function getElement(id) {
  if (!id) return null;
  return get(elements).find(e => e.id === id);
}

/* export function getPhoto(path) {

} */

export function getPhoto(code) {
  if (!code) return '';
  // https://fpl-server.vercel.app/photos/players/110x140/pXXXXXXX.png
  return `https://resources.premierleague.com/premierleague/photos/players/110x140/p${code}.png`;
}

/**
 * Get team information
 * @param {number} id team id
 * @returns 
 */
export function getTeam(id) {
  return derived(teams, $t => $t.find(t => t.id === id));
}

/**
 * Get object with urls to team badges
 * @param {number} code 
 * @returns { Object{small: string, big: string} } - url object
 */
export function teamBadge(code) {
  if(!code) code = 0;
  return {
    big: `https://fpl-server.vercel.app/dist/img/badges/badge_${code}_80.png`,
    small: `https://fpl-server.vercel.app/dist/img/badges/badge_${code}_40.png`
  }
}