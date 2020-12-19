// Model is to define the Schema (structure) of object we are storing

const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
})

module.exports = model('User', userSchema);