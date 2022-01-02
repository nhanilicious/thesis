describe('Input Validation', () => {

    beforeEach(() => {

        cy.visit("/");

    })

    afterEach(() => {

        cy.get('div[name=configurator]').screenshot();

    })

    it('Enabled/disabled input by default', () => {

        cy.get('[name=elems]').should('be.enabled');

        cy.get('[name=width]').should('not.be.enabled');
        cy.get('[name=height]').should('not.be.enabled');
        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Enabled/disabled input for Odd-even sort', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();

        cy.get('[name=width]').should('be.enabled');
        cy.get('[name=submit]').should('be.enabled');
        cy.get('[name=elems]').should('be.enabled');

        cy.get('[name=height]').should('not.be.enabled');

    })

    it('Enabled/disabled input for Shear sort', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

        cy.get('[name=width]').should('be.enabled');
        cy.get('[name=height]').should('be.enabled');
        cy.get('[name=elems]').should('be.enabled');
        cy.get('[name=submit]').should('be.enabled');

    })

    it('Undefined algorithm', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('[name=elems]').click();

        cy.contains('required');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Odd-even sort: negative width', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();

        cy.get('[name=width]').clear().type(-1);
        cy.contains('must be positive');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Odd-even sort: undefined width', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();

        cy.get('[name=width]').clear();
        cy.contains('required');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Odd-even sort: negative number of elements', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();

        cy.get('[name=elems]').clear().type(-1);
        cy.contains('must be positive');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Shear sort: negative width', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

        cy.get('[name=width]').clear().type(-1);
        cy.contains('must be positive');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Shear sort: undefined width', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

        cy.get('[name=width]').clear();
        cy.contains('required');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Shear sort: negative height', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

        cy.get('[name=height]').clear().type(-1);
        cy.contains('must be positive');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Shear sort: undefined height', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

        cy.get('[name=height]').clear();
        cy.contains('required');

        cy.get('[name=submit]').should('not.be.enabled');

    })

    it('Shear sort: negative elems', () => {

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

        cy.get('[name=elems]').clear().type(-1);
        cy.contains('must be positive');

        cy.get('[name=submit]').should('not.be.enabled');

    })

})