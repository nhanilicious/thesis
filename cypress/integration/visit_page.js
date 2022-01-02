describe('My First Test', () => {
    it('Visits the application page', () => {

        cy.visit("/");

        cy.contains('Algorithm');
        cy.contains('Width');
        cy.contains('Height');
        cy.contains('Elements');
        cy.contains('Simulate');
        cy.contains('Step');
        cy.contains('Speed');

        cy.get('[name=prev]').should('not.be.enabled');
        cy.get('[name=play]').should('not.be.enabled');
        cy.get('[name=next]').should('not.be.enabled');

        cy.screenshot();

    })
})