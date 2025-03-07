/// <reference types="cypress" />

Cypress.Commands.add('selectDayOfCurrentMonth', (day: number) => {
  const dayString = day.toString();

  cy.get('mat-calendar')
    .should('be.visible')
    .within(() => {
      cy.get('button.mat-calendar-body-cell')
        .contains(new RegExp(`^\\s*${dayString}\\s*$`))
        .click();
    });
});
