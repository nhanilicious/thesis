describe('Subsequent configurations', () => {

    beforeEach(() => {

        cy.visit("/");

    })

    it('Test 1', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();
        cy.get('[name=width]').clear().type(4);
        cy.get('[name=submit]').click();

        cy.wait(2000);

        cy.get('[name=next]').should('be.enabled');
        cy.get('[name=play]').should('be.enabled');
        cy.get('[name=prev]').should('be.enabled');

        cy.screenshot();

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();
        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(4);
        cy.get('[name=submit]').click();

        cy.wait(2000);

        cy.get('[name=next]').should('be.enabled');
        cy.get('[name=play]').should('be.enabled');
        cy.get('[name=prev]').should('be.enabled');

        cy.screenshot();

    })

    it('Test 2', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();
        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(4);
        cy.get('[name=submit]').click();

        cy.wait(2000);

        cy.get('[name=next]').should('be.enabled');
        cy.get('[name=play]').should('be.enabled');
        cy.get('[name=prev]').should('be.enabled');

        cy.screenshot();

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();
        cy.get('[name=width]').clear().type(4);
        cy.get('[name=submit]').click();

        cy.wait(2000);

        cy.get('[name=next]').should('be.enabled');
        cy.get('[name=play]').should('be.enabled');
        cy.get('[name=prev]').should('be.enabled');

        cy.screenshot();

    })

})

