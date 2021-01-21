import React from 'react';
import { Button } from 'react-bootstrap';
import PremierContext from '../PremierContext';

export default function SettingsPage({}) {

  const { recentSearches, defaultUser, defaultPage, clearCache } = React.useContext(PremierContext);

  const clearUserCache = (e) => {
    e.preventDefault();
    clearCache();
  }

  return (
    <div className="layout-wrapper">
      <div className="settings-main" id="emoji-bg">
        <div className="settings-buttons">
          <div className="cache-option">
            <div className="option-title">Cache</div>
            <div className="option-info">
              <div>
                <small>{`${recentSearches.length} searched profiles.`}</small>
              </div>
              <div>
                <small>{`Default team set: ${!!defaultUser && defaultUser != 0}`}</small>
              </div>
              <div>
                <small>{`Last page visited: ${defaultPage ? defaultPage : 'unknown'}`}</small>
              </div>
            </div>
            <div className="option-action">
              <Button variant="light" size="sm" block onClick={clearUserCache}>Clear cache</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}