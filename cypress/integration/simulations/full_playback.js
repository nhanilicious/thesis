describe('Full simulation', () => {

    it('5x1 Odd-even sort with 8 elements', () => {

        cy.visit("/");

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Odd Even Sort').click();

        cy.get('[name=width]').clear().type(5);
        cy.get('[name=elems]').type(8);
        cy.get('[name=submit]').click();

        cy.wait(2000);
        cy.screenshot();

        cy.get('[name=play]').click();

        let delta = 0.3;
        for (let i=0; i<(10.0/delta); ++i) {

            cy.wait(delta*1000);
            cy.screenshot();

        }

    })

})