import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Rating from './Rating'

const Product = ({ product }) => {
    return (
        <>
            <Card className="my-4 p-2">
                <Link to={`/product/${product._id}`}>
                    <Card.Img src={product.image} />
                </Link>
                <Card.Body>
                    <Link to={`/product/${product._id}`}>
                        <Card.Title as="div">
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>
                    <Card.Text as="div">
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </Card.Text>
                    <Card.Text as="h3">
                        ${product.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}

export default Product