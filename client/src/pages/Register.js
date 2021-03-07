import React, { useContext, useState } from "react";
import { Button, Form, Container, Message } from "semantic-ui-react";
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { AuthContext } from '../context/auth'

const Register = (props) => {

    const context = useContext(AuthContext);

    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState({});

    // Handle Input change
    const handleInputs = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    // Submitting form and getting response to Register User
    const [addUser, { loading }] = useMutation(REGISTER_USER, {

        update: (proxy, result) => {
            context.login(result.data.register);
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
        addUser();
    }

    return (
        <div id="register_page">
            <Container>
                <div className="heading">
                    <h1>User Registration</h1>
                </div>

                <div className='form_wrapper'>
                    <Form noValidate onSubmit={onSubmit} className={loading ? 'loading' : ''} error={Object.keys(errors).length > 0 ? true : false}>

                        <Form.Input
                            label='Username'
                            name="username"
                            type='text'
                            value={values.username}
                            placeholder="Enter Username"
                            onChange={handleInputs}
                            fluid
                            // error={errors.username ? { content: `${errors.username}`, pointing: "below" } : false}
                            error={errors.username ? true : false}
                        />

                        <Form.Input
                            label='Email'
                            type='email'
                            name="email"
                            value={values.email}
                            placeholder="Enter Email"
                            onChange={handleInputs}
                            fluid
                            // error={errors.email ? { content: `${errors.email}`, pointing: "below" } : false}
                            error={errors.email ? true : false}

                        />


                        <Form.Input
                            label='Password'
                            type='password'
                            name="password"
                            value={values.password}
                            placeholder="Enter Password"
                            onChange={handleInputs}
                            fluid
                            // error={errors.password ? { content: `${errors.password}`, pointing: "below" } : false}
                            error={errors.password ? true : false}
                        />

                        <Form.Input
                            label='Confirm Password'
                            type='password'
                            name="confirmPassword"
                            value={values.confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleInputs}
                            fluid
                            // error={errors.confirmPassword ? { content: `${errors.confirmPassword}`, pointing: "below" } : false}
                            error={errors.confirmPassword ? true : false}
                        />


                        <Button
                            type='submit'
                            color='teal'
                        >
                            Register
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
    );
}


// Query to send server to Register User
const REGISTER_USER = gql`
    mutation register(
        $username : String!
        $email : String!
        $password : String!
        $confirmPassword : String!
    ){
        register(registerInput: {
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        }){
            id
            email
            token
            createdAt
            username
        }
    }
`

export default Register;
