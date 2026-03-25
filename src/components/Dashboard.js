import { useState, useEffect } from 'react'
import React from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const [error, setError] = useState("");
    const {currentUser, logout, dataConnect} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch user data from database
      const fetchUserData = async () => {
        try {
          await dataConnect.query('GetUser', { username: currentUser.email.split('@')[0] });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      if (currentUser) {
        fetchUserData();
      }
    }, [currentUser, dataConnect]);

    async function handleLogout(){
        setError('');

        try{
            await logout();
            navigate('/login');
        } catch{
            setError('Failed to log out');
        }
    }
  return (
    <div>
      <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <strong>Email: </strong>{currentUser.email}
                <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
            </Card.Body>
            
        </Card>
        <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
                Log Out
            </Button>
        </div>
        </>
    </div>
  )
}
