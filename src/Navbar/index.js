import React from 'react';
import { Navbar, Form } from 'react-bootstrap';

export default function NavBar({ toggleMenu, returnHome }) {
  
  return (
    <Navbar 
      collapseOnSelect 
      expand="md" 
      variant="dark" 
      sticky="top" 
      className="justify-content-between" 
      style={{backgroundColor: '#37003c', filter: 'drop-shadow(0px 0px 2px #050505)'}}
    >
      <Navbar.Brand className="navbar-brand-title" onClick={returnHome}>FPL Mate</Navbar.Brand>
      <Form inline>
        <div onClick={() => toggleMenu()} style={{color: '#FFF'}}>
          <i className="fas fa-bars"></i>
        </div>
      </Form>
    </Navbar>
  )
}