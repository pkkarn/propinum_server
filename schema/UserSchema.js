const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    credits: {
        type: Number,
        default: 3
    }
})

module.exports = mongoose.model('user', UserSchema);