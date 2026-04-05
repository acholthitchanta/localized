import React from 'react'
import { Card, Button, Alert, Spinner } from 'react-bootstrap'

export default function Business({business}) {
  return (
    <>
    <Card key={business.id} style={{ width: '50vw', margin: '1rem auto' }}>
        <Card.Body>
            <Card.Img src={business.logo}/>
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
    </>
  )
}
