describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.wait(500);
  });

  it('Creates a new song entry', () => {
    cy.get('[data-test="add-song-button"]').should('be.visible').click();

    cy.get('input[formcontrolname="title"]').should('be.visible').clear();

    // Then, re-get the input and type
    cy.get('input[formcontrolname="title"]')
      .should('be.visible')
      .type('My Made-Up Song');

    cy.get('input[placeholder="Añade un género"]')
      .should('be.visible')
      .type('Rock{enter}');

    cy.get('mat-select[formcontrolname="companies"]')
      .should('be.visible')
      .click();
    cy.get('#mat-option-2').should('be.visible').click();
    cy.get('body').type('{esc}');

    cy.get('button[aria-label="Open calendar"]').should('be.visible').click();

    cy.selectDayOfCurrentMonth(15);

    cy.get('body').type('{esc}');

    cy.get('input[formcontrolname="rating"]')
      .should('be.visible')
      .clear()
      .type('10');

    cy.contains('button', 'Guardar').should('be.visible').click();

    cy.get('mat-card-title').should('contain.text', 'My Made-Up Song');
  });
});
