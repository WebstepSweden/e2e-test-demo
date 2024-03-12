// Create a new database and switch to it
db = db.getSiblingDB("currencyTracker");

// Create a user with read and write privileges for the database
db.createUser({
  user: "testuser",
  pwd: "test123",
  roles: [{ role: "readWrite", db: "currencyTracker" }],
});
