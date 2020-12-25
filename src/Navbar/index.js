import React, { useContext } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import PremierContext from '../PremierContext/PremierContext';

export default function NavBar() {
  const { clearProfile, team } = useContext(PremierContext);

  const clearInfo = e => {
    e.preventDefault();
    clearProfile();
  }
  
  return (
    <Navbar collapseOnSelect expand="md" variant="dark" sticky="top" className="justify-content-between" style={{backgroundColor: '#37003c'}}>
      <Navbar.Brand className="navbar-brand-title">FPL Mate</Navbar.Brand>
      <Form inline>
        <Button type="submit" className="navbar-searchButton" onClick={clearInfo} disabled={!team}>Find User</Button>
      </Form>
    </Navbar>
  )
}