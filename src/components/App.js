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
import ViewProfile from "./ViewProfile";
import Business from "./Business";
import './index.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar/>
          <Container>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/add-business" element={<AddBusiness/>} />
              <Route path="/business/:id" element={<Business />}/>
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile/></PrivateRoute>}/>
              <Route path="/view-profile" element={<PrivateRoute><ViewProfile/></PrivateRoute>}/>

            </Routes>
          </Container>
      </Router>
    </AuthProvider>

  );
}

export default App;