
/**
 * Get position. If under 1%, returns 2 decimal accyracy, else 0 decimal.
 * @param {number} rank players position
 * @param {number} players Amount of players
 * @returns {string} `Top: x% || Bottom: x%`
 */
 export function rankPercent(rank, players) {
  if (!rank || !players) return null;
  let npl = rank / players * 100;
  let pos = npl < 1 ? Math.round(npl*100) / 100 : Math.round(npl);
  return pos < 50 ? `Top: ${pos}%` : `Bottom: ${100-pos}%`;
}

/**
 * Abbrevates position. _1 decimal accuracy_
 * @param {number} rank players position 
 * @returns {string} Abrevated rank. xxx.xK
 */
export function rankLabel(rank) {
  if (!rank) return '?'; // |.?.|
  // Not on the mood to think -> throwing an ugly 'simple' if else mayhem.
  // Potentially, we could have only ifs as they return, but for clarity keeping elses.
  if (rank < 4) return rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd';
  else if (rank < 1E3) return `${rank}th`; // 1E3 == 10^3 == 1K
  else if (rank < 1E6) return `${+(rank /= 1E3).toFixed(1)}K`; // 10^6 == 1M
  else return `${+(rank /= 1E6).toFixed(1)}M`;
}

/**
 * Sort matches by gameday.
 * @param {Array} matches matches array.
 */
export function gameDays(matches) {
  console.log(matches);

  const lastIdx = (arr, key, val) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (new Date(arr[i][key]).getDate() === val) return i;
    }
    return -1;
  }

  return matches.reduce((out, match, i, arr) => {
    let gameday = new Date(match.kickoff_time).getDate();
    let last = lastIdx(arr, 'kickoff_time', gameday);
    if (last <= i) {
      out.push({ 
        gameday, 
        label: new Date(match.kickoff_time).toDateString(),
        labelArr: new Date(match.kickoff_time).toDateString().split(' '),
        matches: arr.reduce((day, m) => { // Recursive - optimise?
          if (new Date(m.kickoff_time).getDate() === gameday) day.push(m);
          return day;
        }, [])
      });
    }
    return out;
  }, []);
}

/**
 * Check if gameweek still has unplayed matches.
 * @param {Object[]} events matches of gameweek
 * @returns {boolean}
 */
export function unplayedMatches(events) {
  if (!events || !Array.isArray(events)) return false;
  let unplayed = events.filter(e => !e.finished && !e.finished_provisional);
  return !!unplayed.length;
}