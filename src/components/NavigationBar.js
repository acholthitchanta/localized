import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import NavBarDropdown from './NavBarDropdown';

export default function NavigationBar() {
  const navigate = useNavigate()
  return (
    <Navbar expand="lg"  style={{fontSize: '1.3rem'}} className="white">
      <Container>
        <Navbar.Brand className="link" onClick={() => navigate('/')} style={{fontSize: '2.5rem'}}>LOCALized</Navbar.Brand>

        <div style={{marginLeft: 'auto', marginRight: '0'}}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>HOME</Nav.Link>
            <NavBarDropdown/>
          </Nav>
        </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}
