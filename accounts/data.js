module.exports = {
    accounts: [
      {
        id: "12345",
        name: "Alice",
        email: "alice@email.com",
        password: "pAsSWoRd!",
        roles: ["admin"],
        permissions: ["read:any_account", "read:own_account", "read:any_astronaut", "read:any_mission"]
      },
      {
        id: "67890",
        name: "Bob",
        email: "bob@email.com",
        password: "pAsSWoRd!",
        roles: ["subscriber"],
        permissions: ["read:own_account", "read:own_mission"]
      }
    ]
  };