const { INVALID_CURRENCY } = require("../fixtures/constants");

describe("Currency tracking feature", () => {
  beforeEach(() => {
    // Here we use the API to login instead of doing it using UI actions
    // To avoid re-testing things covered by other tests
    cy.login();
    cy.visit("/");
  });

  it("Can add a currency to the tracking list", () => {
    // Using a random and unique currency name for each test run
    // to allow us to run eahc test multiple times without resetting
    // the state of the system
    const currency = randomCurrency();
    cy.get("input").type(currency);
    cy.get("fieldset > button[type='submit']").click();
    cy.get("#my-tracked-currencies-table ").should("include.text", currency);

    // Assert tracked currency is persisted on reload
    cy.reload();
    cy.get("#my-tracked-currencies-table ").should("include.text", currency);
  });

  it("Cannot track a currency multiple times", () => {
    const currency = randomCurrency();
    // Here we use the API to track the currency instead of using UI actions
    // To avoid re-testing things covered by other tests
    cy.track(currency);
    cy.get("input").type(currency);
    cy.get("fieldset > button[type='submit']").click();

    cy.get("#error")
      .should("include.text", "Currency is already tracked")
      .and("include.text", currency);
  });

  it("Cannot track an invalid currency", () => {
    cy.get("input").type(INVALID_CURRENCY);
    cy.get("fieldset > button[type='submit']").click();

    cy.get("#error")
      .should("include.text", "Not a valid currency")
      .and("include.text", INVALID_CURRENCY);

    cy.get("#my-tracked-currencies-table ").should(
      "not.include.text",
      INVALID_CURRENCY
    );
  });
});

const randomCurrency = () => `testcoin-${Cypress._.random(0, 1e6)}`;
