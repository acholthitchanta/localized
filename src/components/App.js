import React from "react";
import SignUp from "./Signup";
import Login from "./Login";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "./Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import AddBusiness from "./AddBusiness";
import NavigationBar from "./NavigationBar";
import './index.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar/>
          <Container className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh", flexDirection: 'column'}}>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/addbusiness" element={<AddBusiness/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile/></PrivateRoute>}/>
            </Routes>
          </Container>
      </Router>
    </AuthProvider>

  );
}

export default App;