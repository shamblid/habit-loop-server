const { UserModel } = require('../../model/Habit');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const JWT_SECRET = 'supersecret'
    const resolvers = {
      Query: {
        // fetch the profile of currently authenticated user
        async me (_, args, { user }) {
          // make sure user is logged in
          if (!user) {
            throw new Error('You are not authenticated!')
          }

          // user is authenticated
          return await User.findById(user.id, user.created_at)
        }
      },

      Mutation: {
        // Handle user signup
        async signup (_, { id, username, email, password, role }) {
          const user = await UserModel.create({
            id,
            username,
            email,
            created_at: Date.now(),
            role,
            password: await bcrypt.hash(password, 10)
          })

          // return json web token
          return jsonwebtoken.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1y' }
          )
        },

        // Handles user login
        async login (_, { email, password }) {
          const user = await User.findOne({ where: { email } })

          if (!user) {
            throw new Error('No user with that email')
          }

          const valid = await bcrypt.compare(password, user.password)

          if (!valid) {
            throw new Error('Incorrect password')
          }

          // return json web token
          return jsonwebtoken.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
          )
        }
      }
    }