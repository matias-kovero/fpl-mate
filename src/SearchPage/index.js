import React, { useContext } from 'react';
import PremierContext from '../PremierContext';

import SearchUser from './components/SearchUser';
import RecentSearch from './components/RecentSearch';

export default function SearchPage({ openMainPage }) {
  const { searchProfile, recentSearches } = useContext(PremierContext);
  const img_base = "https://fpl-server.vercel.app/dist/img/shirts/standard/shirt_0";
  //
  return (
    <div className="layout-wrapper">
      <div className="landing-main">
        <div className="landing-logo">
          <div style={{paddingTop: '43%', fontSize: 'smaller', color: '#975d9e'}}>
            Logo
          </div>
        </div>
        <div className="landing-text">
          <div style={{paddingTop: '20%', fontSize: 'smaller', color: '#975d9e'}}>
            Small description
          </div>
        </div>
        <div className="landing-text-additional">
          <div style={{paddingTop: '5%', fontSize: 'smaller', color: '#975d9e'}}>
            Describe action
          </div>
        </div>
        <div className="landing-action-box">
          <div style={{paddingTop: '8%', fontSize: 'smaller', color: '#975d9e'}}>
            Action container aka "Search Team"
          </div>
        </div>
        <div className="landing-footer-logo">
          <div style={{paddingTop: '8%', fontSize: 'smaller', color: '#975d9e'}}>
            Footer Logo
          </div>
        </div>
      </div>
      {/*
      <div className="layout-main">
        <div className="content-container">
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
                    <SearchUser searchProfile={searchProfile} />
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
                      <RecentSearch key={i} user={r} openMainPage={openMainPage} />
                    )
                  }) : null }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="layout-secondary"></div>
                */}
    </div>
  )
}