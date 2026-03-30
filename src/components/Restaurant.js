import React, { useState, useEffect } from 'react'
import { Card, Button, Alert, Spinner } from 'react-bootstrap'
import { getAllBusinesses } from '../services/businessService'

export default function Restaurant() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    <div style={{ padding: '2rem' }}>
      {businesses.length === 0 ? (
        <Alert variant="info">No businesses available at this time.</Alert>
      ) : (
        businesses.map((business) => (
          <Card key={business.id} style={{ width: '50vw', margin: '1rem auto' }}>
            <Card.Body>
              <Card.Title style={{ fontSize: '2rem' }}>
                {business.name || 'Unnamed Business'}
              </Card.Title>
              {business.category && (
                <Card style={{ width: 'fit-content', margin: '1rem 0' }}>
                  <Card.Title style={{ margin: 'auto', padding: '0.5rem' }}>
                    {business.category}
                  </Card.Title>
                </Card>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  )
}
