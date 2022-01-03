describe('Navigation', () => {

    it('4x4 Shear sort with 20 elements', () => {

        cy.visit("/");

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(4);
        cy.get('[name=elems]').type(20);
        cy.get('[name=submit]').click();

        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=steps]').parent().click();
        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=prev]').click();
        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=next]').click();
        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=next]').click();
        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=steps]').parent().click('right');
        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=next]').click();
        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=steps]').parent().click('left');
        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=prev]').click();
        cy.wait(2000);
        cy.screenshot();

    })

})