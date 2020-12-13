import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { useDispatch, useSelector } from 'react-redux'
import { Image, Card, Row, Col, ListGroup, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'

import { getOrderDetails, updateOrderToDelivered, updateOrderToPaid } from '../actions/orderActions'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match }) => {
    const id = match.params.id
    const [sdkReady, setSdkReady] = useState(false)
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { loading, error, order } = orderDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    useEffect(() => {
        const addPayPalScript = async (id) => {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            const { data: clientId } = await axios.get('/api/config/paypal')
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if (!order || order._id !== id || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(id))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, order, id, successPay, successDeliver])

    const payOrderHandler = (paymentResult) => {
        dispatch(updateOrderToPaid(id, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(updateOrderToDelivered(id))
    }

    return (
        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (<>
            <h1>Order {order._id}</h1>
            <Row className='my-3'>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>Address: {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                            {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>Method: {order.paymentMethod}</p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <ListGroup variant='flush'>
                                {order.orderItems.length === 0 ? (<Message>Order is empty</Message>) : (
                                    order.orderItems.map((item, index) => (
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
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> :
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={payOrderHandler} />}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && (
                                <ListGroup.Item>
                                    <Button
                                        size='sm'
                                        block
                                        onClick={deliverHandler}>Mark As Delivered</Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>)
    )
}

export default OrderScreen
