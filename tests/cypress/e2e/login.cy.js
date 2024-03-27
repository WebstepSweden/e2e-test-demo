const { TEST_USER } = require("../fixtures/constants");

describe("Login feature", () => {
  it("Valid user can log in", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.get('[name="username"]').type(TEST_USER.username);
    cy.get('[name="password"]').type(TEST_USER.password);
    cy.get("button").click();
    cy.url().should("not.include", "/login");
    cy.get("h2").should("have.text", "My Tracked Currencies");
  });

  it("Invalid user cannot log in", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.get('[name="username"]').type("invalid-username");
    cy.get('[name="password"]').type("invalid-password");
    cy.get("button").click();
    cy.url().should("include", "/login").and("include", "error=1");
  });

  it("Valid user can log out", () => {
    // Here we use the API to login instead of doing it using UI actions
    // To avoid re-testing things covered by other tests
    cy.login();
    cy.visit("/");
    cy.get("button[type='submit'].secondary").click();
    cy.url().should("include", "/login");
  });
});
