import React from "react";
import SignUp from "./Signup";
import Login from "./Login";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "./Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute'


function App() {
  return (
    <AuthProvider>
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh"}}>
          <div className="w-100" style={{maxWidth: '400px'}}>

            <Router>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
                  <Route path="/signup" element={<SignUp/>} />
                  <Route path="/login" element={<Login/>} />
                </Routes>
              </AuthProvider>
            </Router>
          </div>
      </Container>
    </AuthProvider>

  );
}

export default App;