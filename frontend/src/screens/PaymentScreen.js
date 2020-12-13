import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h2>Payment Method</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            id='paymentMethod'
                            label='PayPal or Credit Card'
                            value='PayPal'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        {/* <Form.Check
                        type='radio'
                        id='paymentMethod'
                        label='Stripe'
                        value='Stripe'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    /> */}
                    </Col>
                </Form.Group>
                <Button type='submit'>Continue</Button>

            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
