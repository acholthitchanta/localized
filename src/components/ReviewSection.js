import React, { useState, useRef } from 'react'
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import ReactStars from 'react-stars'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { submitReview, hasUserReviewed, getReviews} from '../services/businessService'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { useEffect } from 'react'

export default function ReviewSection({businessId}){

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const {currentUser} = useAuth();
    const [rating, setRating] = useState('')
    const navigate = useNavigate();
    const  titleRef = useRef();
    const bodyRef = useRef();
    const [reviews, setReviews] = useState([])

    const [reviewLoading, setReviewLoading] = useState(false)
    const [reviewError, setReviewError] = useState('')

    useEffect(()=>{
        const fetchReviews = async() => {
            try{
                setLoading(true)
                const data = await getReviews(businessId)
                console.log("Reviews Fetched:", data)
                setReviews(data)
                setReviewError(null)
            }
            catch(err){
                console.error("Error fetching review:", err)
                setReviewError("Failed to load reviews. Please try again")
            }
            finally{
                setReviewLoading(false)
            }
        }

        fetchReviews()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('')

        if (rating === 0) {
            return setError('Please select a star rating.')
        }

        try {
            setLoading(true)

            const alreadyReviewed = await hasUserReviewed(businessId, currentUser.uid)
            if (alreadyReviewed) {
            return setError('You have already reviewed this business.')
            }

            await submitReview(
                businessId,
                currentUser.uid,
                currentUser.email,
                rating,
                titleRef.current.value,
                bodyRef.current.value
            )

            setMessage('Review submitted successfully!')
            setRating(0)
            titleRef.current.value = ''
            bodyRef.current.value = ''
        } catch (err) {
            console.error(err)
            setError('Failed to submit review. Please try again.')
        } finally {
            setLoading(false)
        }
        }
    
        return (

        !currentUser ? <Navigate to="/login" replace/> : (
        <div>
            <Button style={{margin: '1rem 0'}} onClick={handleOpen}>Review Business</Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'white',
                border: '1px solid black',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                minWidth: 400,
                zIndex: 99
            }}>

                <Button
                    variant="close"
                    onClick={handleClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem' }}
                />
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                Submit a Review
                </Typography>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <div>
                    <ReactStars
                        count={5}
                        value={rating}
                        onChange={(val) => setRating(val)}
                        color2="#f5a623"
                        size={30}
                    />
                    </div>
                </Form.Group>

                <Form.Group className="mb-3" id="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" ref={titleRef} placeholder="Summarize your experience" required />
                </Form.Group>

                <Form.Group className="mb-3" id="body">
                    <Form.Label>Review</Form.Label>
                    <Form.Control as="textarea" rows={4} ref={bodyRef} placeholder="Tell others about your experience" required />
                </Form.Group>

                <Button disabled={loading} className="w-100 mt-2" type="submit">
                    {loading ? <Spinner animation="border" size="sm" /> : 'Submit Review'}
                </Button>
                </Form>
            </Box>
            </Modal>
            <div>
            {reviews.length === 0 ? (
                <Alert variant="info">No reviews yet. Be the first to review!</Alert>
            ) : (
                reviews.map((review) => (
                    <Card key={review.id} style={{ margin: '1rem 0' }}>
                    <Card.Body>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <small className="text-muted">{review.userEmail}</small>
                            <Card.Title style={{ marginBottom: 0 }}>{review.title}</Card.Title>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <small className="text-muted">
                            {review.createdAt?.toDate().toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                            </small>
                            <ReactStars
                            count={5}
                            value={review.rating}
                            color2="#f5a623"
                            edit={false}
                            size={20}
                            />
                        </div>
                        </div>
                        <Card.Text style={{ marginTop: '1rem' }}>{review.body}</Card.Text>
                    </Card.Body>
                    </Card>
                ))
            )}
            </div>

        </div>)
    );
}