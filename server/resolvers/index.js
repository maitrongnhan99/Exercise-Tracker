const UserModel = require('../models')
const ExercisesModel = require('../models/ExercisesModel')

const resolvers = {
    Query: {
        user: async (_, { id }) => {
            return UserModel.findOne({ _id: id })
        },
        exercises: async (_, { userId }) => {
            return ExercisesModel.find({ user: userId }).populate('user')
        },
        getLogs: async (_, { userId, from, to, limit = 0 }) => {
            const user = await UserModel.findOne({
                _id: userId,
            })

            const query = {
                user: userId,
            }

            if (from) {
                query.date = { $gte: from }
            }
            if (to) {
                query.date = { ...query.date, $lte: to }
            }

            const exercises = await ExercisesModel.find(query, {
                _id: 0,
                description: 1,
                duration: 1,
                date: 1,
            }).limit(limit)

            return {
                _id: user.id,
                username: user.username,
                count: exercises.length,
                log: exercises.map((exercise) => {
                    return {
                        description: exercise.description,
                        duration: exercise.duration,
                        date: new Date(exercise.date ?? new Date()).toDateString(),
                    }
                }),
            }
        },
        users: async () => {
            return UserModel.find({})
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

}

module.exports = resolvers
