import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { getMyOrderList } from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'


const RegisterScreen = ({ location, history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { success } = userUpdate

    const orderList = useSelector(state => state.orderList)
    const { loading: loadingList, error: errorList, orders } = orderList

    // const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user.name || user.name !== userInfo.name) {
                dispatch(getUserDetails('profile'))
                dispatch(getMyOrderList())
                dispatch({ type: USER_UPDATE_PROFILE_RESET })

            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [userInfo, history, dispatch, user])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')

        } else {
            dispatch(updateUserProfile({ name, email, password }))
        }
    }


    return (
        <Row>
            <Col md={4}>
                <h2>User Profile</h2>
                {error && <Message variant='danger'>{error}</Message>}
                {message && <Message variant='danger'>{message}</Message>}
                {success && <Message variant='success'>Profile Updated</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                    >
                        Update
                </Button>
                </Form>
            </Col>
            <Col md={8}>
                <h2>My Orders</h2>
                <Table striped bordered hover style={{ textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingList ? <Loader /> : errorList ? <Message variant='danger'>{errorList}</Message> : orders.map(order => {
                            return (<tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.paidAt.substring(0, 10)}</td>
                                <td>{order.deliveredAt ? <i className='fas fa-check-circle' /> : <i className='fas fa-times' />}</td>
                                <td><LinkContainer to={`/order/${order._id}`}><Button variant='light' size='sm'>Details</Button></LinkContainer></td>
                            </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default RegisterScreen
