import React, { useEffect, useState } from 'react'
import { Card, Button, Alert, Spinner, Form, InputGroup } from 'react-bootstrap'
import ReactStars from 'react-stars'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    getAllBusinesses,
    bookmarkBusiness,
    removeBookmark,
    isBookmarked
} from '../services/businessService'

const CATEGORIES = [
    'All',
    'Food & Drink',
    'Clothing',
    'Electronics',
    'Health & Beauty',
    'Entertainment',
    'Services'
]

export default function Businesses() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [businesses, setBusinesses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [bookmarks, setBookmarks] = useState({}) 
    const [sortOrder, setSortOrder] = useState('none')

    const [isWide, setIsWide] = useState(window.innerWidth > 1200)

    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth > 1200)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                //fetching data from the backend 
                const data = await getAllBusinesses()
                setBusinesses(data)
                
                if (currentUser) {
                    try {
                        const bookmarkStates = {}
                        await Promise.all(data.map(async (b) => {
                            bookmarkStates[b.id] = await isBookmarked(currentUser.uid, b.id)
                        }))
                        setBookmarks(bookmarkStates)
                    } catch (err) {
                        console.error('Failed to load bookmarks:', err)
                    }
                }
            } catch (err) {
                //in case there is an error fetching businesses
                //an error message will show up for the users
                console.error(err)
                setError('Failed to load businesses.')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [currentUser])

    const handleBookmark = async (businessId) => {
        if (!currentUser) {
            navigate('/login')
            return
        }
        try {
            if (bookmarks[businessId]) {
                await removeBookmark(currentUser.uid, businessId)
                setBookmarks(prev => ({ ...prev, [businessId]: false }))
            } else {
                await bookmarkBusiness(currentUser.uid, businessId)
                setBookmarks(prev => ({ ...prev, [businessId]: true }))
            }
        } catch (err) {
            console.error('Bookmark error:', err)
        }
    }

    const filtered = businesses
    .filter(b => selectedCategory === 'All' || b.category === selectedCategory)
    .filter(b => b.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'asc') return (a.averageRating ?? 0) - (b.averageRating ?? 0)
        if (sortOrder === 'desc') return (b.averageRating ?? 0) - (a.averageRating ?? 0)
        return 0
    })

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spinner animation="border" />
        </div>
    )

    if (error) return <Alert variant="danger">{error}</Alert>

    return (
        <div style={{ width: '80vw', margin: '2rem auto' }}>

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Search businesses..."
                    value={search}
                    className="form"
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ boxShadow: 'none', outline: 'none'}}
                />
            </InputGroup>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {CATEGORIES.map(cat => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'dark' : 'outline-dark'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Sort selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span>Sort by rating:</span>
                <Button
                    size="sm"
                    variant={sortOrder === 'asc' ? 'dark' : 'outline-dark'}
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'none' : 'asc')}
                >
                    ↑ Lowest
                </Button>
                <Button
                    size="sm"
                    variant={sortOrder === 'desc' ? 'dark' : 'outline-dark'}
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'none' : 'desc')}
                >
                    ↓ Highest
                </Button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: isWide ? '1fr 1fr' : '1fr',
                gap: '1rem'
            }}>

            {filtered.length === 0 ? (
                <Alert variant="info">No businesses found.</Alert>
            ) : (
                filtered.map(business => (
                    <Card key={business.id}  style={{ marginBottom: '1rem', maxWidth: isWide ? '600px' : '80vw' }}>
                    <Card.Body 
                        className="blockPanel businessPanel" 
                        style={{ 
                            display: 'flex', 
                            flexDirection: window.innerWidth <= 500 ? 'column' : 'row',  
                            gap: '30px', 
                            alignItems: 'center',
                            padding: window.innerWidth <= 500 ? '0' : undefined  
                        }}
                    >
                        <Card.Img
                            src={business.logo}
                            style={{ 
                                height: window.innerWidth <= 500 ? '200px' : '120px',  
                                width: window.innerWidth <= 500 ? '100%' : '120px',    
                                objectFit: 'cover', 
                                borderRadius: window.innerWidth <= 500 ? '8px 8px 0 0' : '8px'  
                            }}
                        />
                            <div style={{ flex: 1 }}>
                                <Card.Title
                                    className="link"
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
                                        <small className="text-muted"><strong>{business.averageRating}</strong> ({business.totalRatings} ratings)</small>
                                    )}
                                </div>
                            </div>

                            {/* Bookmark button */}
                            <img
                                src="/bookmark.png"
                                alt="bookmark"
                                onClick={() => handleBookmark(business.id)}
                                title={currentUser ? (bookmarks[business.id] ? 'Remove bookmark' : 'Bookmark') : 'Login to bookmark'}
                                style={{
                                    width: '25px',
                                    height: '25px',
                                    cursor: 'pointer',
                                    filter: bookmarks[business.id]
                                        ? 'invert(0) drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black)'
                                        : 'invert(1) drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black)',
                                    transition: 'filter 0.2s ease'
                                }}
                            />
                        </Card.Body>
                    </Card>

                ))

            )}
            </div>
        </div>
    )
}