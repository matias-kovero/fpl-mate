import { getElement } from "./fantasy";

/**
 * Track every stats from an match
 * @param {Object} match match entity
 * @returns 
 */
function getMatchStats(match) {
  if (!match || !match.started || !match.stats) return null;
  // Dirrty dirty 2AM code - could maybe clean but cbb.
  let { a: ag, h: hg } = match.stats.find(s => s.identifier === 'goals_scored');
  let { a: aa, h: ha } = match.stats.find(s => s.identifier === 'assists');
  let { a: aog, h: hog } = match.stats.find(s => s.identifier === 'own_goals');
  let { a: aps, h: hps } = match.stats.find(s => s.identifier === 'penalties_saved');
  let { a: apm, h: hpm } = match.stats.find(s => s.identifier === 'penalties_missed');
  let { a: ayc, h: hyc } = match.stats.find(s => s.identifier === 'yellow_cards');
  let { a: arc, h: hrc } = match.stats.find(s => s.identifier === 'red_cards');
  let { a: as, h: hs } = match.stats.find(s => s.identifier === 'saves');

  return {
    goals: ag.concat(hg),
    assists: aa.concat(ha),
    own_goals: aog.concat(hog),
    penalties_saved: aps.concat(hps),
    penalties_missed: apm.concat(hpm),
    yellow_cards: ayc.concat(hyc),
    red_cards: arc.concat(hrc),
    saves: as.concat(hs)
  };
}

/**
 * Calculates points on every player in given match.
 * @param {Object} match match entity
 * @param {Object} live livedata
 */
export function playersFromMatch(match, live) {
  // Sanity check
  console.log(match, live);
  if (!match || !live || !live.elements.length) return null;
  let elements = [];
  // Check every gamestat and add found players to array for point future calculation.
  elements = match.stats.reduce((out, i, arr) => {
    let players = i.a.concat(i.h); // Smash away/home players together.
    if (players.length) {
      let ids = players.map(e => e.element);
      out.push(...ids);
    }
    return out;
  }, []);
  // Remove duplicates, as players in multiple gamestats are duplicated
  elements = [... new Set(elements)];
  // Supply our player array to calculation
  return calculateMatch(elements, match, live);
}

function calculateMatch(elements, match, live) {
  let players = [];
  let stats = getMatchStats(match);

  for (let element of elements) {
    let player = getElement(element);
    if (!player) continue; // I'm fck'd, yaiks
    let points = getPlayerPoints(player.id, live, match.id);
    // Legacy syntax from Jan 20 - should refine
    let { bonus, remove } = getPlayerBonus(player.id, { gameweek: [match] });
    let cards = { yellow: [], red: [] };

    if (stats) {
      cards.yellow = stats.yellow_cards.find(p => p.element === element);
      cards.red = stats.red_cards.find(p => p.element === element);
    }

    if (bonus && points === player.event_points) {
      // Match has ended and the api already has calculated points for player.
      // Removing our own calculations to avoid duplicated bonus points.
      if (remove) points = (points - remove); // Maybe -= remove;
    }

    players.push({ player,
      points: { value: points, bonus: bonus },
      cards: { 
        yellow: cards.yellow ? cards.yellow.value : 0, 
        red: cards.red ? cards.red.value : 0 
      },
      sort: points + bonus,
    });
  }
  // Sort by points
  players.sort((a, b) => b.sort - a.sort);

  return players;
}

/**
 * Check player points from livedata.
 * @param {number} id player id
 * @param {Object} live livedata object 
 * @param {number} fixture fixture id
 */
function getPlayerPoints(id, live, fixture) {
  // Sanity checks
  if (!live) return null;
  let player = live.elements.find(e => e.id === id);
  if (!player) return null;

  // Cryptic glyptic code - reduces are an mess (reducing an reduce, rlyy..)
  if (player.explain.length && player.explain[0].stats) {
    return player.explain.map(f => {
      return f.stats.reduce((a,b) => {
        return a + b.points;
      }, 0);
    }).reduce((a,b) => a + b, 0);
  } else return null;
}
/**
 * Calculate players possible BPS, when match is still live.
 * @param {number} id player id
 * @param {Object} match possible array of match entity?
 */
function getPlayerBonus(id, match) {
  // Sanity checks
  if (!match.gameweek) return null;
  let points = 0, remove = 0;

  // Looping matches, player might have multiple matches on gameweek.
  match.gameweek.forEach((m) => {
    let m_points = 0;
    if (!m.started || !m.stats) return;
    let bps = m.stats.find(s => s.identifier === "bps");
    let players = [...bps.a, ...bps.h].sort((a,b) => b.value - a.value);
    // Check if our player is found in bps
    if (!players.find(i => i.element === id)) return;
    // This code could need optimisation - cbb
    let f = Math.max.apply(Math, players.map(o => o.value));
    let s = Math.max.apply(Math, players.map(o => o.value != f ? o.value : null));
    let t = Math.max.apply(Math, players.map(o => o.value != f && o.value != s ? o.value : null));

    let p3 = players.filter(p => p.value === f);
    let p2 = players.filter(p => p.value === s);
    let p1 = players.filter(p => p.value === t);

    if (p3.find(i => i.element === id)) m_points += 3;
    else if (p2.find(i => i.element === id)) {
      if (p3.length < 2) m_points += 2;
      else if (p3.length < 3) m_points += 1;
    }
    else if (p1.find(i => i.element === id)) {
      if (p3.length + p2.length < 3) m_points += 1;
    }
    // Add points from match to ovr
    points += m_points;
    // If match already ended, we need to remove the bps to avoid duplicated points
    if (m.finished && m.finished_provisional) remove += m_points;
  });
  return { bonus: points, remove };
}

/**
 * Check if any of the given matches has started.
 * @param {Object} matches matches entity
 */
function isStarted(matches) {
  if (!matches || !matches.gameweek) return false;
  let started = matches.gameweek.filter(m => m.started);
  return !!started.length;
}