import React, { useContext, useEffect, useState } from 'react';
import Menu from 'react-burger-menu/lib/menus/slide';
import './App.css';
import 'rsuite/dist/styles/rsuite-default.css';
import PremierContext from './PremierContext/PremierContext';

import Navbar     from './Navbar';
import MainApp    from './MainApp';
import SearchPage from './SearchPage';

export default function App() {
  const context = useContext(PremierContext);
  const [ menuOpen, setMenu ] = useState(false);
  const [ page, setPage ] = useState('');

  useEffect(() => {
  }, [ context ]);

  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  const handleChange = (e) => {
    setMenu(e.isOpen);
  }
  const closeMenu = () => {
    setMenu(false);
  }
  const toggleMenu = () => {
    setMenu(!menuOpen);
  }
  
  const findUser = () => {
    closeMenu();
    context.clearProfile();
    context.setDefaultPage("Profile");
  }

  const switchPage = (page) => {
    closeMenu();
    setPage(page);
  }

  const manageContent = (key) => {
    switch(key) {
      case "Search":
        return <SearchPage openMainPage={ () => switchPage('') } />
      case "Settings":
        return <div>Settings page</div>
      default:
        return <MainApp team={context.team} context={context} searchProfile={context.GetTeamInfo} activePage={context.setDefaultPage} />
    }
  }

  return (
    <div id="outher-container" style={{height: '100%'}}>
      <Menu
        right width={230}
        pageWrapId="page-wrap" 
        outerContainerId="outher-container"
        isOpen={menuOpen}
        onStateChange={handleChange}
        disableAutoFocus
        customBurgerIcon={false}
        itemListElement="div"
      >
        <div id="home" className="menu-item" onClick={() => switchPage('Search')}>
          <div>
            <i className="fas fa-user"></i>
            <span>Find User</span>
          </div>
        </div>
        <div id="home" className="menu-item" onClick={() => closeMenu()}>
          <div>
            <i className="fas fa-cog"></i>
            <span style={{ textDecoration:'line-through', color:'#ffffff61'}}>Settings</span>
          </div>
        </div>
      </Menu>
      <main id="page-wrap" style={{ overflow: 'auto', height: '100%'}}>
        <Navbar toggleMenu={toggleMenu} returnHome={() => setPage('')} />
        { manageContent(page) }
        {/*<MainApp team={context.team} context={context} searchProfile={context.GetTeamInfo} activePage={context.setDefaultPage} />*/}
      </main>
    </div>
  )
}