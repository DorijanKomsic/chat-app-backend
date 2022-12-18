const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Can't be blank!"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        index: true,
        required: [true, "Can't be blank!"],
        validate: [isEmail, "Invalid email"]
    },
    password: {
        type: String,
        required: [true, "Can't be blank!"]
    },
    newMessages: {
        type: Object,
        default: {}
    },
    Status: {
        type: String,
        default: 'Online'
    }

}, {minimize: false});

const User = mongoose.model('User', UserSchema);
module.exports = User;