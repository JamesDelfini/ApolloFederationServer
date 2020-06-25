const { and, or, rule, shield } = require("graphql-shield");

function getPermissions(user) {
  if (user && user["https://awesomeapi.com/graphql"]) {
    return user["https://awesomeapi.com/graphql"].permissions;
  }
  return [];
}

const canReadAnyMission = rule()((parent, args, { user }) => {
    const userPermissions = getPermissions(user);
    
    if (!userPermissions) return false;
    if (userPermissions.includes("read:any_mission")) return true;

    return 'Insufficient Permission!';
    // return PermissionError; In returning the PermissionError or False the default shield error of graphql is "Not Authorised!"
});

const canReadOwnMission = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);

    if (!userPermissions) return false;
    if (userPermissions.includes("read:own_mission")) return true;

    return 'Insufficient Permission!';
});

const permissions = shield({
  Query: {
    mission: or(and(canReadOwnMission), canReadAnyMission),
    missions: canReadAnyMission
  }
});

module.exports = { permissions };