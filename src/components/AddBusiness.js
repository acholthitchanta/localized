import React, {useRef, useState, useEffect} from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createBusiness, uploadLogo } from '../services/businessService';


export default function AddBusiness() {
    const nameRef = useRef();
    const categoryRef = useRef();
    const dealRef = useRef();
    const logoRef = useRef();
    const addressRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault()

        setLoading(true)
        setError("")
        setMessage('')


        try{
            const file = logoRef.current.files[0]

            let logoURL = ""

            if (file){
                logoURL = await uploadLogo(file)
            }

            await createBusiness({
                name: nameRef.current.value,
                category: categoryRef.current.value,
                deal: dealRef.current.value || "",
                address: addressRef.current.value,
                logo: logoURL
            })

            navigate('/')
        }
        catch(err){
            setError("Failed to add business")
            setLoading(false)
            console.error(err)
        }

    }
  return (
    <div  className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh", flexDirection: 'column'}}>
    <Card className="w-100" style={{maxWidth: '400px'}}>
        <Card.Body>
            <h2 className="text-center mb-4">Add Business</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" ref={nameRef} required />
                </Form.Group>
                <Form.Group id="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" ref={addressRef} required />
                </Form.Group>

                <Form.Group id="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select type="text" ref={categoryRef} required >
                        <option value="">Select a category</option>
                        <option value="Food & Drink">Food & Drink</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Services">Services</option>
                    </Form.Select>
                </Form.Group>


                <Form.Group id="logo">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control type="file" ref={logoRef} required />
                </Form.Group>
                
                <Form.Group id="deal">
                    <Form.Label>Deal</Form.Label>
                    <Form.Control type="text" ref={dealRef}  placeholder="Leave blank if no deal" />
                </Form.Group>

                <Button disabled={loading} className="w-100  mt-3" type="submit">Add Business</Button>
            </Form>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
    </div>
    </div>
  )
}
