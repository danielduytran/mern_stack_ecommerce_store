import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { getAdminOrderList } from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch()

    const orderAdminList = useSelector(state => state.orderAdminList)
    const { loading, error, orders } = orderAdminList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(getAdminOrderList())
            console.log('check');
        } else {
            history.push('/login')
        }
    }, [dispatch, history, userInfo])

    return (
        <>
            <h2>Orders</h2>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.paidAt.substring(0, 10)}</td>
                                <td>{order.isDelivered ? <i className='fas fa-check' style={{ color: 'green' }} /> : <i className='fas fa-times' style={{ color: 'red' }} />}</td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button size='sm' variant='light'>Details</Button>
                                    </LinkContainer>
                                </td>
                            </tr>))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default OrderListScreen
