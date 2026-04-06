import React from 'react'
import { Card, Button, Alert, Spinner } from 'react-bootstrap'
import ReactStars from 'react-stars'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBusiness, getDeal } from '../services/businessService';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ReviewSection from './ReviewSection.js'

export default function Business() {
  const {id} = useParams();
  const [business, setBusiness] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deal, setDeal] = useState(null)


  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect( ()=>{
    const fetchBusinesses = async(id) => {
      try{
          setLoading(true)
          const data = await getBusiness(id)
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

  useEffect(() => {
    if (!id) return
    const fetchDeals = async () => {
      try {
        const data = await getDeal(id)
        setDeal(data)
      } catch (err) {
        console.error("Error fetching deals:", err)
      }
    }
    fetchDeals()
  }, [id])

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
    <Card key={business.id} style={{ margin: '2rem 0',width: '80vw' }}>
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
              <Card.Text><strong>{business.averageRating}</strong> ({business.totalRatings} ratings)</Card.Text>
            )}
            </div>
            </div>
        </Card.Body>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Overview" value="1" />
                    <Tab label="Reviews" value="2" />
                    <Tab label="Deals" value="3" />
                    <Tab label="Map" value="4" />
                  </TabList>
                </Box>
                <TabPanel value="1">{(business.overview) || "No description available"}</TabPanel>
                <TabPanel value="2">{(business.reviews) || "Visited? Submit this businesses's first review!"} <ReviewSection businessId={business.id}/></TabPanel>
                <TabPanel value="3">
                    {!business.deal ? (
                        <Alert variant="info">No active deal at this time.</Alert>
                    ) : (
                        <Card>
                            <Card.Body>
                                <Card.Text>{business.deal}</Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </TabPanel>
              </TabContext>
          </Box>
    </Card>
    </>
  )
}
