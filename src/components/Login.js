import React, {useRef, useState, useEffect} from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate} from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const {login} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            const result = await login(emailRef.current.value, passwordRef.current.value)

            if (!result.user.emailVerified){
                await signOut(auth)
                return setError("Please verify your email before logging in.")
            }
            navigate('/')
        }
        catch{
            setError('failed to log in')
        }
        setLoading(false)

    }
  return (
    <>
    <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Button disabled={loading} className="w-100 mt-3" type="submit">Log In</Button>
            </Form>

        <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
    </div>
    </>
  )
}
