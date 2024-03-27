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
