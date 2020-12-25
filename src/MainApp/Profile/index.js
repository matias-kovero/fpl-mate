import React, { useContext, useEffect, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
//import UserInfo   from '../../MainPage/Profile/TeamInfo';
import PremierContext from '../../PremierContext';

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
  //
  return (
    <div className="layout-wrapper">
      { user && user.id ? 
        <div className="layout-main">
          <UserInfo user={user} />
          <UserTeam team={user} />
          {/* <PitchView user={user} context={context} /> */}
        </div> : ( user && user.err ? 
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
    console.log('Searching with ID:', id);
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