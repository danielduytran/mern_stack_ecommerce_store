import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Image, Card, Row, Col, ListGroup } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'

import { addOrderItems } from '../actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems, shippingAddress, paymentMethod } = cart

    const orderCreate = useSelector(state => state.orderCreate)
    const { success, error, order } = orderCreate

    const addDecimals = (num) => {
        return (num * 100 / 100)
    }

    cart.itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)).toFixed(2)
    cart.shippingPrice = (cartItems.itemsPrice > 1000 ? 0 : 100).toFixed(2)
    cart.taxPrice = (0.15 * Number(cart.itemsPrice)).toFixed(2)
    cart.totalPrice = addDecimals(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`)
        }
    }, [success, history, order])

    const submitHandler = () => {
        dispatch(addOrderItems({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row className='my-3'>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>Address: {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}</p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>Method: {paymentMethod}</p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <ListGroup variant='flush'>
                                {cartItems.length === 0 ? (<Message>Your cart is empty</Message>) : (
                                    cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col md={6}>
                                                    <p>{item.name}</p>
                                                </Col>
                                                <Col md={4}>
                                                    <p>{item.qty} x ${item.price} = ${item.qty * item.price}</p>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>{error && <Message variant='danger'>{error}</Message>}</ListGroup.Item>
                            <ListGroup.Item><Button onClick={submitHandler} block>Place Order</Button></ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen
