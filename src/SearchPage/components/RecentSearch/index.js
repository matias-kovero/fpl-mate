import React from 'react';
import PremierContext from '../../../PremierContext';

/* eslint eqeqeq: "off" */
export default function RecentSearch({ user, openMainPage }){
  const { searchProfile, defaultUser, setDefaultUser, removeDefaultUser, removeFromRecents } = React.useContext(PremierContext);

  const selectUser = (id) => {
    openMainPage();
    searchProfile(id);
  }

  return (
    <div className="recent-search-user">
      <div className="recent-search-body">
        <div className="recent-cell-content" onClick={() => selectUser(user.id) }>
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