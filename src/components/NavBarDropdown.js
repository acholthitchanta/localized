import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

export default function NavBarDropdown() {
    const navigate = useNavigate()
    const {currentUser} = useAuth();
  return (
    currentUser ?    
    <>
    <Nav.Link onClick={() => navigate('/bookmarks')}>BOOKMARKS</Nav.Link>
    <NavDropdown title="SETTINGS" id="basic-nav-dropdown">
        <NavDropdown.Item onClick={() => navigate('/view-profile')}>View Profile</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={() => navigate('/add-business')}>
        Add Business
        </NavDropdown.Item>
    </NavDropdown>
    </> 
    :           
    <Nav.Link onClick={() => navigate('/login')}>LOG IN</Nav.Link>

  )
}
