import React from 'react'
import { Card, Button, Alert, Spinner } from 'react-bootstrap'
import ReactStars from 'react-stars'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBusiness } from '../services/businessService';

export default function Business() {
  const {id} = useParams();
  const [business, setBusiness] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect( ()=>{
    const fetchBusinesses = async(id) => {
      try{
          setLoading(true)
          const data = await getBusiness(id)
          console.log("Business fetched: ", data)
          setBusiness(data)
          setError(null)
      } catch (err){
        console.error("Error fetching busienss:", err)
        setError(err)
      }
      finally{
        setLoading(false)
      }
    }
    fetchBusinesses(id)
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
    <>
    <Card key={business.id} style={{ width: '90vw' }}>
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
