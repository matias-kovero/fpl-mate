import React, { useContext, useEffect } from 'react';
import './App.css';
import PremierContext from './PremierContext/PremierContext';

import Navbar     from './Navbar';
import MainApp    from './MainApp';

// https://stackoverflow.com/questions/34369951/how-to-get-add-to-home-screen-pop-up-on-site-open-in-mobile-browser
// Get basic info of team: https://fantasy.premierleague.com/api/entry/1598128/

export default function App() {

  const context = useContext(PremierContext);

  useEffect(() => {
  }, [ context ]);

  return (
    <>
      <Navbar />
      <MainApp team={context.team} context={context} searchProfile={context.GetTeamInfo} />
    </>
  )
}