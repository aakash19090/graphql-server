//  Resolvers define what actions to be performed for each Type Definitions. In short they can be understood as function Definitions.

// To Hash password
const bcrypt = require('bcryptjs');

// To create Register User Token
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const { SECRET_KEY } = require('../../config'); // Key to Encode your token. Importing from Config
const { UserInputError } = require('apollo-server'); // To show default Apollor Errors for fields
const { validateRegisterInputs, validateLoginInputs } = require('../../util/validators'); // Import Register Input Validations from utils

module.exports = {
    Mutation: {

        // Handle User Login
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInputs(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // Finding User from DB with username
            const user = await User.findOne({ username })

            // If username not found in DB
            if (!user) {
                errors.general = 'User Not Found!'
                throw new UserInputError('User Not Found!', { errors })
            }

            // Verifying Passwords from DB
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong Credentials!'
                throw new UserInputError('Wrong Credentials!', { errors })
            }

            // if User successfully Logged in, then issue a token for user
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username
            }, SECRET_KEY, { expiresIn: '1h' });

            // Returning Data
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },


        // Handle User Registration
        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {

            //  STEP_3: Validate User Data
            const { errors, valid } = validateRegisterInputs(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            //  STEP_2: Make sure User doesn't already exist
            const user_name = await User.findOne({ username })
            const user_email = await User.findOne({ email })

            // Check if Username already exists
            if (user_name) {
                throw new UserInputError('Username is taken', {

                    // Passing Payload or Error object which can be later used in Frontend on Client to diplay errors
                    errors: {
                        username: 'This Username is taken'
                    }
                })
            }

            // Check if Email already exists
            else if (user_email) {
                throw new UserInputError('Email is taken', {

                    // Passing Payload or Error object which can be later used in Frontend on Client to diplay errors
                    errors: {
                        username: 'This Email is taken'
                    }
                })
            }


            // STEP_1: Hash password and create an auth token
            password = await bcrypt.hash(password, 12); // Hashing Password before saving to DB

            // Create a User Object to save to DB
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString() // Storing as date & converting Date to String
            })

            const res = await newUser.save(); // Saving User Object to DB to create a document

            // Creating Auth Token for user before returning data
            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h' });

            // Returning Data
            return {
                ...res._doc,
                id: res._id,
                token,
            }
        }

    }
}