import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword) {
            keyword.trim()
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <>
            <Form onSubmit={submitHandler} inline className='ml-2'>
                <Form.Group>
                    <Form.Control
                        size='sm'
                        className='mr-2'
                        as='input'
                        placeholder='Search Products...'
                        onChange={(e) => setKeyword(e.target.value)}

                    />
                </Form.Group>
                <Button type='submit' size='sm'>Search</Button>
            </Form>
        </>
    )
}

export default SearchBox
