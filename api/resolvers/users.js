const UserModel = require('../../model/User');
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
      const model = new UserModel();
      const result = await model.getByEmail(user.email)
      return result.Items[0]
    }
  },

  Mutation: {
    // Handle user signup
    async signup (_, args) {
      try {
        const {
          id: user_id,
          username,
          password,
          email,
          created_at,
          role
        } = args.input;

        const model = new UserModel();

        const user = await model.create({
          user_id,
          username,
          email,
          created_at,
          role,
          password: await bcrypt.hash(password, 10)
        })

        // return json web token
        return jsonwebtoken.sign(
          { id: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: '1y' }
        )
      } catch (err) {
        console.log(err);
      }
    },

    // Handles user login
    async login (_, { email, password }) {
      const model = new UserModel();
      const results = await model.getByEmail(email)
      const user = results.Items[0];

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

module.exports = resolvers;