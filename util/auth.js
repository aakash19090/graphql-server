const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { AuthenticationError } = require('apollo-server');

module.exports = (context) => {

    // context = { ...headers }

    const authHeader = context.req.headers.authorization;

    // Check if Authorization Header is present

    if (authHeader) {

        // Get Bearer Token from Authorization Header ---- Format -> "Bearer <token>"

        const token = authHeader.split('Bearer ')[1];

        if (token) {
            try {
                // Verify token that user logged in with
                const user = jwt.verify(token, SECRET_KEY);
                return user

            }
            catch (err) {
                throw new AuthenticationError('Invalid/Expired Token');
            }
        }
        throw new Error(`Authentication token must be in format : Bearer <token>`);
    }
    throw new Error(`Authorization header must be provided`);

}