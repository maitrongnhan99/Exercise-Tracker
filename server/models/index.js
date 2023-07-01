const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
)

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
