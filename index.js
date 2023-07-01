const express = require('express')
const app = express()
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./server/typeDefs')
const resolvers = require('./server/resolvers')
const mongoose = require('mongoose')

require('dotenv').config()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/users', async (req, res) => {
    const user = await resolvers.Mutation.createUser(req,  {
        username: req.body.username,
    })
    res.json({
        username: user.username,
        _id: user._id,
    })
})

app.get('/api/users/:id', async (req, res) => {
    const user = await resolvers.Query.user(req, {
        id: req.params.id,
    })

    res.json(user)
})

app.get('/api/users', async (req, res) => {
    const users = await resolvers.Query.users()

    res.json(users)
})

app.post('/api/users/:_id/exercises', async (req, res) => {
    const exercise = await resolvers.Mutation.createExercise(req, {
        user: req.params._id,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date,
    })

    const user = await resolvers.Query.user(req, {
        id: req.params._id,
    })

    res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
    })
})

app.get('/api/users/:_id/logs', async (req, res) => {
    const logs = await resolvers.Query.getLogs(req, {
        userId: req.params._id,
        from: req.query.from,
        to: req.query.to,
        limit: req.query.limit,
    })

    res.json(logs)
})

app.listen({ port: process.env.PORT || 3000 }, () =>
    console.log(`🚀 Server ready at http://localhost:3000`)
)

const MONGODB_CONNECTION_STRING = "mongodb+srv://admin:admin@root.lroip8g.mongodb.net/?retryWrites=true&w=majority"
const server = new ApolloServer({ typeDefs, resolvers })
server.start().then(() => {
    server.applyMiddleware({ app })

    mongoose
        .connect(MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log(`🚀 Database connected`))
        .catch((err) => console.log(err))
})
