const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    image: {
        type: String
    },
    membership: {
        type: String,
        enum: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Topic'
            }
        ]
    },
    registration_date: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    unsuccessful_login: {
        type: Date,
        default: Date.now
    },
    last_update: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema);