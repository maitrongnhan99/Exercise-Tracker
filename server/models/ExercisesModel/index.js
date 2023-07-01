const mongoose = require('mongoose')
const { Schema } = mongoose

const ExercisesModelSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        description: {
            type: String,
        },
        duration: {
            type: Number,
        },
        date: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

const ExercisesModel = mongoose.model(
    'ExercisesModel',
    ExercisesModelSchema,
    'exercises'
)

module.exports = ExercisesModel
