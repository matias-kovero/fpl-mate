import React from 'react';
import PremierContext from '../PremierContext';
import SearchUser from './SearchUser';
import RecentSearch from './RecentUsers';

export default function LandingPage({ openMainPage }) {
  const { searchProfile, recentSearches } = React.useContext(PremierContext);

  return (
    <div className="layout-wrapper">
      <div className="landing-main landing-emoji-bg" id="emoji-bg">
        <div className="landing-logo">
          <div className="landing-logo-image" style={{ fontSize: 'smaller', color: '#481b12fa' }}>
            <picture>
              <source></source>
              <img
                alt="logo"
                id={'page-logo'}
                src={'/apple-touch-icon.png'} 
                srcSet={'/apple-touch-icon.png 180w, /android-chrome-192x192.png 192w, /android-chrome-512x512.png 512w'}
                sizes="(min-width: 360px) 192px, 100px"
              ></img>
            </picture>
          </div>
        </div>
        <div className="landing-header">
          <div style={{fontSize: 'smaller', color: '#ffcc4d'}}>
            <div className="landing-header-title">FPL</div>
            <div className="landing-header-subtitle">Mate</div>
          </div>
        </div>
        <div className="landing-text">
          <div style={{padding: '1rem'}}>
            <p>Fantasy premier league companion app</p>
          </div>
        </div>
        {/*
        <div className="landing-text">
          <div style={{paddingTop: '20%', fontSize: 'smaller', color: '#ae7bb3'}}>
            Small description
          </div>
        </div>
        <div className="landing-text-additional">
          <div style={{paddingTop: '.3rem', fontSize: 'smaller', color: '#ae7bb3', textAlign: 'left', paddingLeft: '.75rem'}}>
            <div>You can search teams with Team name, Player name</div>
            <div>or with team id.</div>
          </div>
        </div>*/}
        <div className="landing-action-box">
          <div style={{fontSize: 'smaller', color: '#ae7bb3'}}>
            <SearchUser searchProfile={searchProfile} />
          </div>
        </div>
        { !!recentSearches.length && 
          <div className="landing-recent-container">
            <div className="recent-divider">
              <div className="recent-line"></div>
              <div className="recent-text">or use recent</div>
              <div className="recent-line"></div>
            </div>
            <div className="recent-profile-wrapper">
              <div className="recent-profile-list">
                { recentSearches ? recentSearches.map((r, i) => {
                  return (
                    <RecentSearch key={i} user={r} switchPage={openMainPage} />
                  )
                }) : null }
              </div>
            </div>
          </div>
        }
        <div className="landing-footer-logo">
          <div style={{padding: '1rem', fontSize: 'smaller', color: '#ffe8b6'}}>
            <small>Mobile users, add this page to your homescreen for a better user experience.</small>
          </div>
        </div>
      </div>
    </div>
  )
}