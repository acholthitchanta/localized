import React from "react";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute'
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import AddBusiness from "./components/AddBusiness";
import NavigationBar from "./components/NavigationBar";
import ViewProfile from "./components/ViewProfile";
import Business from "./components/Business";
import './index.css';
import Bookmarks from "./components/Bookmarks";


function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar/>
          <Container>
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/add-business" element={<PrivateRoute><AddBusiness/></PrivateRoute>} />
              <Route path="/business/:id" element={<Business />}/>
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile/></PrivateRoute>}/>
              <Route path="/view-profile" element={<PrivateRoute><ViewProfile/></PrivateRoute>}/>
              <Route path="/bookmarks" element={<PrivateRoute><Bookmarks/></PrivateRoute>}/>
            </Routes>
          </Container>
      </Router>
    </AuthProvider>

  );
}

export default App;