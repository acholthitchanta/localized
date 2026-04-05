import React from 'react'
import { Card, Button, Alert, Spinner } from 'react-bootstrap'
import ReactStars from 'react-stars'

export default function Business({business}) {
  return (
    <>
    <Card key={business.id} style={{ width: '50vw', margin: '1rem auto' }}>
        <Card.Body style={{display:'flex', gap:'30px'}}>
            <Card.Img src={business.logo} style={{height: '200px', width:'200px', objectFit:'cover'}}/>
            <div>
            <Card.Title style={{ fontSize: '2rem' }}>
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
    </>
  )
}
