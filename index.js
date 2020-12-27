// Import Module Dependencies
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

// Import Relative Dependencies
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers')
const { mongoURL } = require('./config.js');

// Defining Serrver ( Takes 2 arguments => 'typeDefs' & 'resolvers' )
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})


//  Connecting to MongoDB at some port
mongoose.connect(mongoURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected!!')
        return server.listen({ port: 5000 });
    }).then(res => {
        console.log(`Server is running at ${res.url}`);
    })
