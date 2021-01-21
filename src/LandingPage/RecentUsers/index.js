import React from 'react';
import PremierContext from '../../PremierContext';

export default function RecentUser({ user, switchPage }){
  // user: {id, name, owner}

  // Check if user is default user.
  const { searchProfile, defaultUser, setDefaultUser, removeDefaultUser, removeFromRecents } = React.useContext(PremierContext);

  return (
    <div className="recent-profile">
      <div className="recent-profile-content" onClick={() => {
          searchProfile(user.id);
          if (switchPage) switchPage();
        }
      }>
        <div className="recent-profile-default">{user.id == defaultUser && <i className="fas fa-star" />}</div>
        <div className="recent-profile-info">
          <div className="recent-name"><b>{user.owner}</b></div>
          <div className="recent-owner"><small>{user.name}</small></div>
        </div>
      </div>
      <div className="recent-profile-buttons">
        <div className="recent-profile-favourite">
            { user.id != defaultUser ? 
              <i className="far fa-heart" onClick={() => setDefaultUser(user.id)} /> :
              <i className="fas fa-heart" onClick={() => removeDefaultUser()} />
            }
        </div>
        <div className="recent-profile-remove">
          <i className="fas fa-times" onClick={() => removeFromRecents(user.id)} />
        </div>
      </div>
    </div>
  )
}