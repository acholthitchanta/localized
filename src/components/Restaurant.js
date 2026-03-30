import React from 'react'
import { Card, Button, Alert } from 'react-bootstrap'

export default function Restaurant() {
  return (
    <>
        <Card style={{ width: '50vw', margin: '1rem auto'}}>
            <Card.Body>
                <Card.Title style={{fontSize: '2rem'}}>
                    Leverett Lounge
                </Card.Title>
                <Card style={{ width: '5rem', margin: '1rem 0'}}>
                    <Card.Title style={{margin: 'auto', padding:'0.5rem'}}>
                        food
                    </Card.Title>
                </Card>

            </Card.Body>
        </Card>
    </>
  )
}
