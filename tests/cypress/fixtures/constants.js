/*
This file illustrates the need for shared knowldge between tests and test infrastructure.
For instance, the tests need to know which username to use for a successful login.

In this example we're relying on hardcoded values, but they could also be injected dynamically
from the environment. 
*/

// This user must match the user we seed into the database
// on startup in init-database/init-mongo.js
export const TEST_USER = {
  username: "testuser",
  password: "test123",
};

// This value must match the hardcoded invalid currency name
// in api-mock
export const INVALID_CURRENCY = "invalid";
