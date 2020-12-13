import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { detailsProduct, createReviewProduct } from '../actions/productActions'
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Rating from '../components/Rating'
import Meta from '../components/Meta'


const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { loading: loadingReview, error: errorReview, success: successReview } = productReviewCreate

    useEffect(() => {
        if (successReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_REVIEW_CREATE_RESET })
        }
        dispatch(detailsProduct(match.params.id))
    }, [dispatch, match, successReview])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createReviewProduct(match.params.id, { rating, comment }))
    }

    return (
        <>
            <LinkContainer to="/">
                <Button className="mb-3" variant="light">Go Back</Button>
            </LinkContainer>
            {loading ? <Loader /> : error ? <Message>{error}</Message> : (
                <>
                    <Meta title={product.name} />
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} fluid></Image>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h4>{product.name}</h4>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Desciption: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty:</Col>
                                            <Col>
                                                <Form.Control
                                                    as='select'
                                                    value={qty}
                                                    onChange={(e) => {
                                                        setQty(e.target.value)
                                                    }}>
                                                    {[...Array(product.countInStock).keys()].map(x => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Row>
                                        <Col><Button
                                            block
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                        >Add To Cart</Button></Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h3>Reviews</h3>
                            {product.reviews.length === 0 && <Message>No reviews</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h3>Write A Customer Review</h3>
                                    {loadingReview && <Loader />}
                                    {errorReview && <Message variant='danger'>{errorReview}</Message>}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId="reviewRating">
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}>
                                                    <option value=''>Select...</option>
                                                    <option value={1}>1 - Bad</option>
                                                    <option value={2}>2 - Fair </option>
                                                    <option value={3}>3 - Good</option>
                                                    <option value={4}>4 - Very Good</option>
                                                    <option value={5}>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control as='textarea'
                                                    row='3'
                                                    onChange={(e) => setComment(e.target.value)}>
                                                </Form.Control>
                                            </Form.Group>
                                            <Button type='submit'>Submit</Button>
                                        </Form>) : (<p>Please <Link to='/login'>sign in</Link> to write a review</p>)}

                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default ProductScreen
