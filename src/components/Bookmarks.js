import React, { useEffect, useState } from 'react'
import { Card, Alert, Spinner } from 'react-bootstrap'
import ReactStars from 'react-stars'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserBookmarks, getBusiness, removeBookmark } from '../services/businessService'

export default function Bookmarks() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [businesses, setBusinesses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!currentUser) return

        const fetchBookmarks = async () => {
            try {
                setLoading(true)
                const businessIds = await getUserBookmarks(currentUser.uid)
                const businessDocs = await Promise.all(businessIds.map(id => getBusiness(id)))
                setBusinesses(businessDocs)
            } catch (err) {
                console.error(err)
                setError('Failed to load bookmarks.')
            } finally {
                setLoading(false)
            }
        }

        fetchBookmarks()
    }, [currentUser])

    const handleRemove = async (businessId) => {
        try {
            await removeBookmark(currentUser.uid, businessId)
            setBusinesses(prev => prev.filter(b => b.id !== businessId))
        } catch (err) {
            console.error('Failed to remove bookmark:', err)
        }
    }

    if (!currentUser) return <Alert variant="warning" style={{ width: '80vw', margin: '2rem auto' }}>Please log in to view your bookmarks.</Alert>

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spinner animation="border" />
        </div>
    )

    if (error) return <Alert variant="danger">{error}</Alert>

    return (
        <div style={{ width: '80vw', margin: '2rem auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Your Bookmarks</h3>

            {businesses.length === 0 ? (
                <Alert variant="info">You haven't bookmarked any businesses yet.</Alert>
            ) : (
                businesses.map(business => (
                    <Card key={business.id} style={{ marginBottom: '1rem' }}>
                        <Card.Body style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                            <Card.Img
                                src={business.logo}
                                style={{ height: '120px', width: '120px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <Card.Title
                                    style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                                    onClick={() => navigate(`/business/${business.id}`)}
                                >
                                    {business.name || 'Unnamed Business'}
                                </Card.Title>
                                {business.address && (
                                    <Card.Text>
                                        <a style={{ color: 'black', textDecoration: 'none' }}
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            {business.address}
                                        </a>
                                    </Card.Text>
                                )}
                                {business.category && (
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {business.category}
                                    </span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {business.averageRating != null && (
                                        <ReactStars count={5} value={business.averageRating} color2="#f5a623" edit={false} size={20} />
                                    )}
                                    {!!(business.averageRating && business.totalRatings) && (
                                        <small className="text-muted">{business.averageRating} ({business.totalRatings} ratings)</small>
                                    )}
                                </div>
                            </div>

                            {/* Remove bookmark */}
                            <img
                                src="/bookmark.png"
                                alt="remove bookmark"
                                onClick={() => handleRemove(business.id)}
                                title="Remove bookmark"
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    cursor: 'pointer',
                                    filter: 'invert(0) drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black)',
                                    transition: 'filter 0.2s ease'
                                }}
                            />
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    )
}