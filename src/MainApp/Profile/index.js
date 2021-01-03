import React, { useContext, useEffect, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
//import UserInfo   from '../../MainPage/Profile/TeamInfo';
import PremierContext from '../../PremierContext';
import usePremierData from '../usePremierData';

import UserInfo   from '../components/UserInfo';
import UserTeam   from '../components/UserTeam';
//import PitchView  from '../components/PitchView';

export default function Profile({ user }) {
  /*
  const [ team, setTeam ] = useState(user);

  useEffect(() => {
    return () => {

    }
  }, [ user ])*/

  /**
   * Should we load all needed information already here. And only give components their needed info.
   * Load:
   * - Users picks
   * - Live data (able to calculate player points + BPS, before the match ends!)
   * - Team Fixtures
   */
  return (
    <div className="layout-wrapper">
      { user && user.id ? 
          <ActiveProfile user={user} />
          : ( user && user.err ? 
          <div className="layout-main">
            <div className="content-container">
              <h5>{user.err}</h5>
              <p>Please try again later when the updated scores / teams will be available.</p>
            </div>
          </div> : 
          <div className="layout-main">
            <div className="content-container">
              <NoProfilePage />
            </div>
          </div> )
      }
      <div className="layout-secondary"></div>
    </div>
  )
}

const ActiveProfile = ({ user }) => {
  const { fixtures } = useContext(PremierContext);
  const { useGetPick, useLiveData, getPlayerByElement, getTeamById, calculateRoster } = usePremierData();
  const { data: pickData, loading: pickLoading } = useGetPick(user.id, user.current_event);
  const { data: liveData, loading: liveLoading } = useLiveData(user.current_event);
  const [ roster, setRoster ] = useState([]);
  // This should contain all calculated information. In the future, roster, live & teams are obsolete!
  const [ points, setPoints ] = useState(0);

  useEffect(() => {
    if (pickData && liveData) {
      console.log("Stuff loaded...  It's gameweek", user.current_event);
      loadMyStuff();
    }
  }, [pickData, liveData, user]);

  const loadMyStuff = () => {
    // Creating own objects
    let smallFixtures = fixtures.filter(f => f.event >= user.current_event && f.event < (user.current_event + 6)); // To optimize, cut old gameweeks from the array.
    let rawTeams = [];  // Save teams codes, to fetch team info later.
    let players = [];   // List of players and their additional info.
    let localTeams = [];     // List of teams and their additional info.
    let countedArr = { points: 0, data: [] };

    pickData.picks.forEach(p => {
      let player = getPlayerByElement(p.element);
      players.push({ player, ...p });
      /**
       * We could optimize. 
       * Check if team is found in object array by its id. 
       * If not, search team info and add to array.
       */
      if (!rawTeams.includes(player.team)) rawTeams.push(player.team);
    });

    rawTeams.forEach(t => {
      let team = getTeamById(t);
      // It's gameweek: user.current_event.
      let matches = smallFixtures.filter(f => f.team_a === team.id || f.team_h === team.id );
      let gameweek = matches.filter(f => f.event === user.current_event); // Not 100% that only 1 match on gameweek!!!
      localTeams.push({ ...team, gameweek });
    });

    console.log('Player data:', players);
    console.log('Raw team data:', rawTeams);
    console.log('Teams data:', localTeams);

    countedArr = calculateRoster(pickData.picks, liveData, localTeams);
    setRoster(countedArr.data);
    setPoints(countedArr.points);
  }


  return (
    <div className="layout-main">
      <UserInfo user={user} points={points} />
      {roster.length && <UserTeam roster={roster} />}
    </div>
  )

}


const NoProfilePage = ({ }) => {
  const { searchProfile, recentSearches } = useContext(PremierContext);
  const img_base = "https://fpl-server.vercel.app/dist/img/shirts/standard/shirt_0";
  const [ id, setId ] = useState('');

  const onChange = (e) => {
    let value = e.target.value;
    setId(value);
  }

  const onSearch = () => {
    if (!id || id.length <= 0 || isNaN(id)) return null;
    searchProfile(id);
  }

  return (
    <div className="no-profile-wrapper">
      <div className="no-profile-container">
        <div className="search-new-profile">
          <div className="image-cell">
            <picture>
              <source></source>
              <img
                alt="not found"
                className="profile-not-found-image"
                src={`${img_base}-66.png`}
                srcSet={`${img_base}-66.png 66w, ${img_base}-110.png 110w, ${img_base}-220.png 220w`}
                sizes="(min-width: 1024px) 110px, (min-width: 610px) 88px, 55px"
              ></img>
            </picture>
          </div>
          <div className="info-cell">
            <div>
              <b>No profile selected</b>
            </div>
            <div>
              <small>Please search a profile</small>
            </div>
            <div>
              <InputGroup className="mt-3" size="sm">
                <FormControl 
                  placeholder="Team ID"
                  aria-label="Team ID"
                  aria-describedby="search-team"
                  value={id}
                  onChange={onChange}
                />
                <InputGroup.Append>
                  <Button variant="outline-success" onClick={onSearch}>Search</Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
          </div>
        </div>
        <div className="search-or">
          <span>or use recent</span>
        </div>
        <div className="select-old-profile">
          <div className="list-old-profile">
            { recentSearches ? recentSearches.map((r, i) => {
              return (
                <RecentSearch key={i} user={r} />
              )
            }) : null }
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Recent searched user
 * @param {Object} props 
 */
const RecentSearch = ({ user }) => {
  // user: {id, name, owner}

  // Check if user is default user.
  const { searchProfile, defaultUser, setDefaultUser, removeDefaultUser, removeFromRecents } = useContext(PremierContext);

  return (
    <div className="recent-search-user">
      <div className="recent-search-body">
        <div className="recent-cell-content" onClick={() => searchProfile(user.id)}>
          <div className="recent-cell-default">{user.id == defaultUser && <i className="fas fa-star" />}</div>
          <div className="recent-cell-info">
            <div className="recent-name"><b>{user.name}</b></div>
            <div className="recent-owner"><small>{user.owner}</small></div>
          </div>
        </div>
        <div className="recent-cell-buttons">
          <div className="recent-cell-remove-default">
              { user.id != defaultUser ? 
                <i className="far fa-heart" onClick={() => setDefaultUser(user.id)} /> :
                <i className="fas fa-heart" onClick={() => removeDefaultUser()} />
              }
          </div>
          <div className="recent-cell-remove-recent">
            <i className="fas fa-times" onClick={() => removeFromRecents(user.id)} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* Default TAB ELEMENT
import React from 'react';

export default function Profile({ }) {
  //
  return (
    <div className="layout-wrapper">
      <div className="layout-main"></div>
      <div className="layout-secondary"></div>
    </div>
  )
}
*/