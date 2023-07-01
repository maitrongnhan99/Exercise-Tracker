const UserModel = require('../models')
const ExercisesModel = require('../models/ExercisesModel')

const resolvers = {
    Query: {
        user: async (_, { username, id }) => {
            return UserModel.findOne({ $or: [{ username }, { _id: id }] })
        },
        exercises: async (_, { userId }) => {
            return ExercisesModel.find({ user: userId }).populate('user')
        },
        getLogs: async (_, { userId, from, to, limit = 0 }) => {
            const user = await UserModel.findOne({ _id: userId })

            const query = {
                user: userId,
            }

            if (from) {
                query.date = { $gte: from }
            }
            if (to) {
                query.date = { ...query.date, $lte: to }
            }

            console.log(query)

            const exercises = await ExercisesModel.find(query).limit(limit)

            return {
                _id: user._id,
                username: user.username,
                count: exercises.length,
                log: exercises,
            }
        },
    },
    Mutation: {
        createUser: async (_, { username }) => {
            return UserModel.create({ username })
        },
        createExercise: async (_, { user, description, duration, date }) => {
            return ExercisesModel.create({
                user,
                description,
                duration,
                date,
            })
        },
    },
    // Exercise: {
    //     user: (parent) => {
    //         return UserModel.findById(parent.userId)
    //     },
    // },
}

module.exports = resolvers
