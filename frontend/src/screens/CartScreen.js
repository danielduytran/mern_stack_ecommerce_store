import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { addToCart, removeFromCart } from '../actions/cartActions'
import Message from '../components/Message'

const CartScreen = ({ match, location, history }) => {
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()

    const { cartItems } = useSelector(state => state.cart)

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeItemHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const cartCheckoutHandler = () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={9}>
                <h2>Shopping Cart</h2>
                {cartItems.length === 0 ? <Message>Your cart is empty <Link to='/'>Go back</Link></Message> : (
                    <ListGroup variant='flush'>{cartItems.map(item => {
                        return (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={3}>
                                        <Image src={item.image} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <p>{item.name}</p>
                                    </Col>
                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as='select'
                                            value={item.qty}
                                            onChange={(e) => {
                                                dispatch(addToCart(item.product, Number(e.target.value)))
                                            }}>
                                            {[...Array(item.countInStock).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <i className='fas fa-trash' onClick={() => removeItemHandler(item.product)} />
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )
                    })}</ListGroup>
                )}
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h4>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) Items</h4>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button disabled={cartItems.length === 0} block onClick={cartCheckoutHandler}>Proceed to Checkout</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
