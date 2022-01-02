describe('Odd-even sort configurations', () => {

    beforeEach(() => {

        cy.visit("/");

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();

    })

    afterEach(() => {

        cy.get('[name=submit]').click();
        cy.wait(2000);

        cy.get('[name=next]').should('be.enabled');
        cy.get('[name=play]').should('be.enabled');
        cy.get('[name=prev]').should('be.enabled');

        cy.screenshot();

    })

    it('Grid: default (1x1); Elems: default (1)', () => {})

    it('Grid: default (1x1); Elems: 4', () => {

        cy.get('[name=elems]').type(4);

    })

    it('Grid: default (1x1); Elems: 9', () => {

        cy.get('[name=elems]').type(9);

    })

    it('Grid: 4x1; Elems: 1', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=elems]').type(1);

    })

    it('Grid: 4x1; Elems: default (4)', () => {

        cy.get('[name=width]').clear().type(4);

    })

    it('Grid: 4x1; Elems: 9', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=elems]').type(9);

    })

    it('Grid: 9x1; Elems: 1', () => {

        cy.get('[name=width]').clear().type(9);
        cy.get('[name=elems]').type(1);

    })

    it('Grid: 9x1; Elems: 4', () => {

        cy.get('[name=width]').clear().type(9);
        cy.get('[name=elems]').type(4);

    })

    it('Grid: 9x1; Elems: default (9)', () => {

        cy.get('[name=width]').clear().type(9);

    })

})