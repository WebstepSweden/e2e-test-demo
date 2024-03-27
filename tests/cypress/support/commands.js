/*
This is where you put extensions to the Cypress command collection.

For instance "login" is now accessible from tests as `cy.login()`.

These examples illustrate how you can utilize the frontend's API to
bypass UI steps. To write tests that require less steps, are more
isolated and will fail more expressively.

An error on the login page should not cause errors in tests for
features that require a logged-in user. Which is what would happen
if the logged-in tests use the UI to log in.
*/

const { TEST_USER } = require("../fixtures/constants");

// Create a logged in session by sending a form POST to the backend
Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: "/login",
    body: `username=${TEST_USER.username}&password=${TEST_USER.password}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((response) => cy.wrap(response));
});

// Tracks a currency by sending a form POST to the backend
Cypress.Commands.add("track", (currency) => {
  cy.request({
    method: "POST",
    url: "/track-currency",
    body: { currency: currency },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => cy.wrap(response));
});
