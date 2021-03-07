import React, { useContext, useState } from "react";
import { Button, Form, Container, Message } from "semantic-ui-react";
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const PostForm = () => {

    const [values, setValues] = useState({
        body: '',
    
    })

    const handleInputs = (event) => {
        setValues({
            body : event.target.value
        })
    }

    const [ createPost, {error} ] = useMutation(CREATE_POST, {
        variables: values,

        onError() {},
        update : (proxy, result) => {

            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })

            // data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({
                    query: FETCH_POSTS_QUERY, 
                    data : { getPosts: [result.data.createPost, ...data.getPosts] } 
                });

            // Reset Body field after submitting Form
            values.body = ''
        }
    })

    const onSubmit = (event) => {
        event.preventDefault();
        createPost();
    }

    return (
        <div id='post_form'>
            <Container>
                <div className="heading">
                    <h4>Create a Post</h4>
                </div>

                <div className='form_wrapper'>
                    <Form noValidate onSubmit={onSubmit} error = { error ? true : false}>
                        <Form.Input
                            type="text"
                            name="body"
                            placeholder="Hello World!"
                            onChange={handleInputs}
                            value={values.body}
                            fluid
                            error = { error ? true : false}
                        />

                        <Button
                            type='submit'
                            color='teal'
                        >
                            Create
                        </Button>

                         {/* Displaying Error/Validation messages as List */}

                         {  error && (
                            <Message error>
                                <Message.List>
                                    <Message.Item> { error.graphQLErrors[0].message } </Message.Item>
                                </Message.List>
                            </Message>

                        )}

                    </Form>
                </div>

            </Container>
        </div>
    )
}

const CREATE_POST = gql`
    mutation (
        $body : String!
    ) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            comments {
                id
                body
                username
                createdAt
            }
            likes {
                id
                username
                createdAt
            }
            likeCount
            commentCount
        }
    }

`

export default PostForm
