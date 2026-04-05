import React, { useState, useEffect } from 'react'
import { Card, Button, Alert, Spinner } from 'react-bootstrap'
import { getAllBusinesses } from '../services/businessService'
import ReactStars from 'react-stars'
import { useNavigate } from 'react-router-dom'

export default function Restaurant() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true)
        const data = await getAllBusinesses()
        console.log('Businesses fetched:', data)
        setBusinesses(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching businesses:', err)
        setError('Failed to load businesses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <div style={{margin:'20px auto', flexDirection: 'column'}} className="d-flex align-items-center justify-content-center" >
      {businesses.length === 0 ? (
        <Alert variant="info">No businesses available at this time.</Alert>
      ) : (
        businesses.map((business) => (
          <Card key={business.id} style={{ width: '50vw', margin: '1rem auto' }}>
            <Card.Body style={{display:'flex', gap:'30px'}}>
                <Card.Img src={business.logo} style={{height: '200px', width:'200px', objectFit:'cover'}}/>
                <div>
                <Card.Title style={{ fontSize: '2rem' }} onClick={() => navigate(`/business/${business.id}`)}>
                {business.name || 'Unnamed Business'}
                </Card.Title>
                {business.address && <Card.Text><a style={{color:"black", textDecoration:"none"}}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                target="_blank"
                rel="noopener noreferrer">{business.address}</a></Card.Text>}
                {business.category && (
                <Card style={{ width: 'fit-content', marginTop:'0.5rem' }}>
                    <Card.Title style={{ margin: 'auto', padding: '0.5rem' }}>
                    {business.category}
                    </Card.Title>
                </Card>
                )}
                <div style={{display: 'flex', gap:'20px', alignItems: 'center'}}>
                {business.averageRating != null &&  <ReactStars count={5} value={business.averageRating} color2="#f5a623" edit={false} size="30"/>}
                {!!(business.averageRating && business.totalRatings) && (
                  <Card.Text>{business.averageRating} (<strong>{business.totalRatings}</strong> ratings)</Card.Text>
                )}
                </div>
                </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  )
}
