import React, {useRef, useState} from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const {currentUser, passwordUpdate, emailUpdate} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    
    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }

        const promises = []
        setLoading(true)
        setError("")
        setMessage('')

        if (emailRef.current.val !== currentUser.email){
            promises.push(emailUpdate(emailRef.current.value))
        }

        if (passwordRef.current.value){
            promises.push(passwordUpdate(passwordRef.current.value))
        }

        Promise.all(promises).then(()=>{
        }).catch(()=>{
            if (emailRef.current.val !== currentUser.email) setMessage('Check your new email to confirm the change');
        }).finally(()=>
            setMessage(''),
            setLoading(false)
        )

    }
  return (
    <>
    <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                </Form.Group>

                <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef}  placeholder="Leave blank to keep the same"/>
                </Form.Group>
                
                <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef}  placeholder="Leave blank to keep the same" />
                </Form.Group>

                <Button disabled={loading} className="w-100  mt-3" type="submit">Update Profile</Button>
            </Form>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
    </div>
    </>
  )
}
