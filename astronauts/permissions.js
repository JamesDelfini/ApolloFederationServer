const { rule, shield, PermissionError } = require("graphql-shield");

function getPermissions(user) {
  if (user && user["https://awesomeapi.com/graphql"]) {
    return user["https://awesomeapi.com/graphql"].permissions;
  }
  return [];
}

const canReadAnyAstronaut = rule()((parent, args, { user }) => {
    const userPermissions = getPermissions(user);

    if (!userPermissions) return false;
    if (userPermissions.includes("read:any_astronaut")) return true;

    return 'Insufficient Permission!';
    // return PermissionError; In returning the PermissionError or False the default shield error of graphql is "Not Authorised!"
});

const permissions = shield({
  Query: {
    astronaut: canReadAnyAstronaut,
    astronauts: canReadAnyAstronaut
  }
});

module.exports = { permissions };