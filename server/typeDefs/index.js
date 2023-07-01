const { gql } = require('apollo-server-express')
const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
    }

    type Exercise {
        _id: ID!
        user: User!
        description: String!
        duration: Int!
        date: String!
    }

    type Log {
        description: String!
        duration: Int!
        date: String!
    }

    type UserLog {
        _id: ID!
        username: String!
        count: Int!
        log: [Log]!
    }

    type Query {
        user(username: String, id: ID): User!
				users: [User!]!
        exercises(userId: String!): [Exercise!]!
        getLogs(userId: String!, from: String, to: String, limit: Int): UserLog!
    }

    type Mutation {
        createUser(username: String!): User!
        createExercise(
            userId: String!
            description: String!
            duration: Int!
            date: String!
        ): Exercise!
    }
`

module.exports = typeDefs
