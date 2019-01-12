const {
  SchemaDirectiveVisitor,
  AuthenticationError,
} = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { role } = this.args;
    field.resolve = async function (...args) {
      const [, , ctx] = args;
      if (ctx && ctx.user) {
        if (role && (!ctx.user.role || !ctx.user.role.includes(role))) {
          throw new AuthenticationError(
            'You are not authorized to view this resource.',
          );
        } else {
          const result = await resolve.apply(this, args);
          return result;
        }

        const result = await resolve.apply(this, args);
        return result;
      }
      throw new AuthenticationError(
        'You must be signed in to view this resource.',
      );
    };
  }
}

module.exports = RequireAuthDirective;
