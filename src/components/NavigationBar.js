import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';

export default function NavigationBar() {
  const navigate = useNavigate()
  return (
    <Navbar expand="lg" style={{fontSize: '1.3rem'}} className="bg-body-tertiary">
      <Container>
        <Navbar.Brand style={{fontSize: '2.5rem'}}>LOCALized</Navbar.Brand>

        <div style={{marginLeft: 'auto', marginRight: '0'}}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>HOME</Nav.Link>
            <NavDropdown title="SETTINGS" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => navigate('/update-profile')}>View Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Bookmarks</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}
