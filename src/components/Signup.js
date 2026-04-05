import React, {useRef, useState, useEffect} from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';


export default function SignUp() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const {signup} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [verificationSent, setVerificationSent] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }

        try{
            setError('')

            //sign up 
            const result = await signup(emailRef.current.value, passwordRef.current.value)

            await sendEmailVerification(result.user)

            await signOut(auth)

            setVerificationSent(true)

        }
        catch(err){
            console.log(err.code)
            setError('failed to create an account')
        }
        setLoading(false)

    }
  return (
    <div className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh", flexDirection: 'column'}}>
    <Card className="w-100" style={{maxWidth: '400px'}}>
        <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {verificationSent? (
                <Alert variant="success">A email verification has been sent to your inbox. Please verify your email before you login</Alert>
            ): (
                
            <>
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
                
                <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} required />
                </Form.Group>

                <Button disabled={loading} className="w-100  mt-3" type="submit">Sign Up</Button>
            </Form>
            </>
            )}
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log in</Link>
    </div>
    </div>
  )
}
