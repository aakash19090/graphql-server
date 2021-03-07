import React, { useContext, useState } from "react";
import { Button, Form, Container, Message } from "semantic-ui-react";
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { AuthContext } from '../context/auth'

const Login = (props) => {

    const context = useContext(AuthContext);

    const [values, setValues] = useState({
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState({});

    // Handle Input change
    const handleInputs = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }


    // Submitting form and getting response to Login User
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update: (_, result) => {
            context.login(result.data.login)
            props.history.push('/');
        },

        onError: (err) => {
            if (Object.keys(err).length > 0) {
                setErrors(err.graphQLErrors[0].extensions.exception.errors);
            }
            else {
                setErrors({});
            }

        },

        variables: values
    })


    // Handle Form Submission
    const onSubmit = (event) => {
        event.preventDefault();
        loginUser();
    }


    return (
        <div id='login_page'>
            <Container>
                <div className="heading">
                    <h1>User Login</h1>
                </div>

                <div className='form_wrapper'>
                    <Form noValidate onSubmit={onSubmit} className={loading ? 'loading' : ''} error={Object.keys(errors).length > 0 ? true : false}>
                        <Form.Input
                            label='Username'
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            onChange={handleInputs}
                            error={errors.username ? true : false}
                            fluid
                        />

                        <Form.Input
                            label='Password'
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            onChange={handleInputs}
                            error={errors.password ? true : false}
                            fluid

                        />

                        <Button
                            type='submit'
                            color='teal'
                        >
                            Login
                        </Button>

                        {/* Displaying Error/Validation messages as List */}
                        {Object.values(errors).length > 0 && (
                            <Message error>
                                <Message.Header>Some Errors Below:</Message.Header>
                                <Message.List>
                                    {
                                        Object.values(errors).map(error => (
                                            <Message.Item key={error}> {error} </Message.Item>
                                        ))
                                    }
                                </Message.List>
                            </Message>

                        )}

                    </Form>
                </div>

            </Container>
        </div>
    )
}

// Query to send server to Login User
const LOGIN_USER = gql`
    mutation login(
        $username : String!
        $password : String!
    ){
        login(
            username: $username password: $password
        ){
            id
            email
            token
            createdAt
            username
        }
    }
`

export default Login
