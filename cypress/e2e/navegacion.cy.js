/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("Navegacion basica", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });
  it("Debería cargar la aplicación correctamente", () => {
    cy.get("app-root").should("exist");
  });

  it("Debería navegar a la vista de canción", () => {
    cy.get("app-song-card").first().click();
    cy.url().should("match", /\/songs\/\d+/);
  });

  it("Debería editar correctamente una canción", () => {
    cy.get("app-song-card").first().click();
    cy.url().should("match", /\/songs\/\d+/);

    cy.get("#edit-song").click();
    cy.url().should("match", /\/songs\/edit\/\d+/);

    cy.get('input[formControlName="title"]').clear();

    cy.get('input[formControlName="title"]').type("Prueba canción cypress");

    cy.get(".save-button").click();
    cy.url().should("match", /\/songs\/\d+/);
    cy.get("div.card h2").should('include.text', 'Prueba canción cypress').should('exist');
  });
});
