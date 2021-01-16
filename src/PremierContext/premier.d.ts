export declare interface EntryObject {
  current_event: Number,
  favourite_team: Number,
  /**
   * User team ID
   */
  id: Number,
  joined_time: String,
  kit: null,
  last_deadline_bank: Number,
  last_deadline_total_transfers: Number,
  last_deadline_value: Number,
  leagues: LeagueObject,
  /**
   * Team name
   */
  name: String,
  player_first_name: String,
  player_last_name: String,
  player_region_id: Number,
  player_region_iso_code_long: String,
  player_region_iso_code_short: String,
  player_region_name: String,
  started_event: Number,
  /** Gameweek poinst */
  summary_event_points: Number,
  /** Gameweek rank */
  summary_event_rank: Number,
  /** Live Total Points */
  summary_overall_points: Number,
  /** Live Total Rank */
  summary_overall_rank: Number
}

declare interface LeagueObject {
  classic: ClassicObject[],
  cup: ClubObject,
  h2h: []
}

declare interface ClassicObject {
  admin_entry: null,
  closed: Boolean,
  created: String,
  entry_can_admin: Boolean,
  entry_can_invite: Boolean,
  entry_can_leave: Boolean,
  entry_last_rank: Number,
  entry_rank: Number,
  id: Number,
  league_type: String,
  max_entries: null,
  name: String,
  rank: null,
  scoring: String,
  short_name: String,
  start_event: Number
}

declare interface ClubObject {
  matches: Array[],
  status: {
    qualification_event: Number,
    qualification_numbers: Number,
    qualification_rank: null,
    qualification_state: String,
  }
}

declare interface Event {
  average_entry_score: Number,
  chip_plays: [{
    chip_name: String,
    num_played: Number
  }],
  data_checked: Boolean,
  deadline_time: String,
  deadline_time_epoch: Number,
  deadline_time_game_offset: Number,
  finished: true,
  highest_score: Number,
  highest_scoring_entry: Number,
  id: Number,
  is_current: Boolean,
  is_next: Boolean,
  is_previous: Boolean,
  most_captained: Number,
  most_selected: Number,
  most_transferred_in: Number,
  most_vice_captained: Number,
  name: String,
  top_element: Number,
  top_element_info: {
    id: Number,
    points: Number
  },
  transfers_made: Number
}

declare interface Element {
  assists: Number,
  bonus: Number,
  bps: Number,
  chance_of_playing_next_round: Number,
  chance_of_playing_this_round: Number,
  clean_sheets: Number,
  code: Number,
  corners_and_indirect_freekicks_order: Number,
  corners_and_indirect_freekick_text: String,
  cost_change_event: Number,
  cost_change_event_fall: Number,
  cost_change_start: Number,
  cost_change_start_fall: Number,
  creativity: String,
  creativity_rank: Number,
  creativity_rank_type: Number,
  direct_freeckicks_order: Number,
  direct_freekick_text: String,
  dreamteam_count: Number,
  element_type: Number,
  ep_next: String,
  ep_this: String,
  event_points: Number,
  first_name: String,
  form: String,
  goals_conceded: Number,
  goals_scored: Number,
  ict_index: String,
  ict_index_rank: Number,
  ict_index_rank_type: Number,
  id: Number,
  in_dreamteam: Boolean,
  influence: String,
  influence_rank: Number,
  influence_rank_type: Number,
  minutes: Number,
  news: String,
  next_added: String,
  now_cost: Number,
  own_goals: Number,
  penalties_missed: Number,
  penalties_order: String,
  penalties_saved: Number,
  penalties_text: String,
  photo: String,
  points_per_game: String,
  red_cards: Number,
  saves: Number,
  second_name: String,
  selected_by_percent: String,
  special: Boolean,
  squad_number: String,
  status: String,
  team: Number,
  team_code: Number,
  threat: String,
  threat_rank: Number,
  threat_rank_type: Number,
  total_points: Number,
  transfers_in: Number,
  transfers_in_event: Number,
  transfers_out: Number,
  transfers_out_event: Number,
  value_form: String,
  value_season: String,
  web_name: String,
  yellow_cards: Number
}

declare interface ElementType {
  element_count: Number,
  id: Number,
  plural_name: String,
  plural_name_short: String,
  singular_name: String,
  singular_name_short: String,
  squad_max_play: Number,
  squad_min_play: Number,
  squad_select: Number,
  sub_positions_locked: Number[],
  ui_shirt_specific: Boolean
}

declare interface GameweekRoster {
  active_chip: [],
  automatic_subs: Sub[]
  entry_history: {
    bank: Number,
    /** Gameweek */
    event: Number,
    /** How many transfers user made */
    event_transfers: Number,
    /** How much users transfers cost points */
    event_transfers_cost: Number
    /** Season overall rank */
    overall_rank: Number,
    /** Gameweek points */
    points: Number,
    /** Gameweek points from the bench */
    points_on_bench: Number,
    /** Rank on current Gameweek */
    rank: Number,
    /** Sorted rank?? */
    rank_sort: Number,
    /** Overall points on season */
    total_points: Number,
    /** Value of team */
    value: Number
  },
  picks: Pick[]
}

declare interface Sub {
  /** Element ID of player switched to pitch */
  element_in: Number,
  /** Element ID of player switched to bench */
  element_out: Number,
  /** Users Team ID */
  entry: Number,
  /** Gameweek where sub happened */
  event: Number
}

declare interface Pick {
  /** Player element ID */
  element: Number,
  /** Is player selected as captain */
  is_captain: Boolean,
  /** Is player selected as vice captain */
  is_vice_captain: Boolean,
  /** Players score multiplier. Bench = 0, Normal = 1, Captain = 2  */
  multiplier: Number,
  /** Position on the roster. 12-15 are usually bench players. Double check with multiplier */
  position: Number,
}
/**
 * Player Fixture
 */
declare interface ElementFixtures {
  fixtures: Fixture[],
  history: FixtureHistory[],
  history_past: PlayerHistory[]

}
/**
 * Player Fixture
 */
declare interface Fixture {
  code: Number,
  /** Match difficulty */
  difficulty: Number,
  /** Gameweek number */
  event: Number,
  /** Gameweek name */
  event_name: String,
  finished: Boolean,
  id: Number,
  is_home: Boolean,
  kickoff_time: String,
  minutes: Number,
  provisional_start_time: Boolean,
  /** Away Team ID */
  team_a: Number,
  /** Away Team Goals */
  team_a_score: Number | null,
  /** Home Team ID */
  team_h: Number,
  /** Home Team Goals */
  team_h_score: Number | null
}
/**
 * Player Fixture
 */
declare interface FixtureHistory {
  assists: Number,
  bonus: Number,
  bps: Number,
  clean_sheets: Number,
  creativity: String,
  element: Number,
  fixture: Number,
  goals_conceded: Number,
  goals_scored: Number,
  ict_index: String,
  influence: String,
  kickoff_time: String,
  minutes: Number,
  opponent_team: Number,
  own_goals: Number,
  penalties_missed: Number,
  penalties_saved: Number,
  red_cards: Number,
  round: Number,
  saves: Number,
  selected: Number,
  team_a_score: Number,
  team_h_score: Number,
  threat: String,
  total_points: Number,
  transfers_balance: Number,
  transfers_in: Number,
  transfers_out: Number,
  value: Number,
  was_home: Number,
  yellow_cards: Number
}

declare interface PlayerHistory {
  assists: Number,
  bonus: Number,
  clean_sheets: Number,
  creativity: String,
  element_code: Number,
  end_cost: Number,
  goal_conceded: Number,
  goals_scored: Number,
  ict_index: String,
  influence: String,
  minutes: Number,
  own_goals: Number,
  penalties_missed: Number,
  penalties_saved: Number,
  red_cards: Number,
  saves: Number,
  season_name: String,
  start_cost: Number,
  threat: String,
  total_points: Number,
  yellow_cards: Number
}

declare interface Live {
  elements: LiveElement[]
}

declare interface LiveElement {
  /** Element ID */
  id: Number,
  stats: {
    minutes: Number,
    goals_scored: Number,
    assists: Number,
    clean_sheets: Number,
    goals_conceded: Number,
    own_goals: Number,
    penalties_missed: Number,
    yellow_cards: Number,
    red_cards: Number,
    saves: Number,
    bonus: Number,
    bps: Number,
    influence: String,
    creativity: String,
    threat: String,
    ict_index: String,
    total_points: Number,
    in_dreamteam: Boolean
  },
  explain: [{
    fixture: Number,
    stats: [{
      identifier: String,
      points: Number,
      value: Number
    }]
  }]
}

declare interface Match {
  code: Number,
  /** Gameweek */
  event: Number,
  /** Has the match finished */
  finished: Boolean,
  finished_provisional: Boolean,
  id: Number,
  kickoff_time: String,
  minutes: Number,
  provisional_start_time: Boolean,
  pulse_id: Number,
  started: Boolean,
  stats: MatchStats[],
  /** Away Team ID */
  team_a: Number,
  team_a_difficulty: Number,
  team_a_score: Number,
  /** Home Team ID */
  team_h: Number,
  team_h_difficulty: Number,
  team_h_score: Number
}

declare interface MatchStats {
  /** Specify what stat we are referring to */
  identifier: String,
  a: [{
    /** Amount */
    value: Number, 
    /** Players element ID */
    element: Number
  }],
  h: [{
    /** Amount */
    value: Number,
    /** Players element ID */
    element: Number,
  }]
}

declare interface Team {
  /** Team Code. *(usage unknown)* */
  code: Number,
  draw: Number,
  form: null,
  /** Team ID */
  id: Number,
  loss: Number,
  name: String,
  played: Number,
  points: Number,
  position: Number,
  pulse_id: Number,
  short_name: String,
  strength: Number,
  strength_attack_away: Number,
  strength_attack_home: Number,
  strength_defence_away: Number,
  strength_defence_home: Number,
  strength_overall_away: Number,
  strength_overall_home: Number,
  team_division: null,
  unavailable: Boolean,
  win: Number
}

declare interface LeagueStandings {
  league: {
    /** Admins entry Id */
    admin_entry: Number,
    closed: Boolean,
    code_privacy: String,
    /** ISO DateTime String */
    created: String,
    /** League Id, used for API calls */
    id: Number,
    league_type: String,
    max_entries: null,
    /** League Name */
    name: String,
    rank: null,
    scoring: String,
    start_event: Number,
  },
  new_entries: {
    has_next: Boolean,
    page: Number,
    results: StandingsPlayer[]
  },
  standings: {
    has_next: Boolean,
    page: Number,
    results: StandingsPlayer[]
  }
}
declare interface StandingsPlayer {
  /** Users id for API calls */
  entry: Number,
  /** Users team name */
  entry_name: String,
  /** Current gameweek points */
  event_total: Number,
  /** Internal ID?? */
  id: Number,
  last_rank: Number,
  /** Users name */
  player_name: String,
  /** Users current rank */
  rank: Number,
  /** Users total points */
  total: Number
}