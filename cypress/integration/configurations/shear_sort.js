describe('Shear sort configurations', () => {

    beforeEach(() => {

        cy.visit("/");

        cy.get('[name=algorithm]').parent().click();
        cy.get('.v-menu__content').contains('Shear Sort').click();

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

    it('Grid: 1x4; Elems: 1', () => {

        cy.get('[name=height]').clear().type(4);
        cy.get('[name=elems]').type(1);

    })

    it('Grid: 1x4; Elems: default (4)', () => {

        cy.get('[name=height]').clear().type(4);

    })

    it('Grid: 1x4; Elems: 9', () => {

        cy.get('[name=height]').clear().type(4);
        cy.get('[name=elems]').type(9);

    })

    it('Grid: 4x4; Elems: 1', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(4);
        cy.get('[name=elems]').type(1);

    })

    it('Grid: 4x4; Elems: default (16)', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(4);

    })

    it('Grid: 4x4; Elems: 81', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(4);
        cy.get('[name=elems]').type(81);

    })

    it('Grid: 4x5; Elems: 1', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(5);
        cy.get('[name=elems]').type(1);

    })

    it('Grid: 4x5; Elems: default (20)', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(5);

    })

    it('Grid: 4x5; Elems: 81', () => {

        cy.get('[name=width]').clear().type(4);
        cy.get('[name=height]').clear().type(5);
        cy.get('[name=elems]').type(81);

    })

    it('Grid: 5x4; Elems: 1', () => {

        cy.get('[name=width]').clear().type(5);
        cy.get('[name=height]').clear().type(4);
        cy.get('[name=elems]').type(1);

    })

    it('Grid: 5x4; Elems: default (16)', () => {

        cy.get('[name=width]').clear().type(5);
        cy.get('[name=height]').clear().type(4);

    })

    it('Grid: 5x4; Elems: 81', () => {

        cy.get('[name=width]').clear().type(5);
        cy.get('[name=height]').clear().type(4);
        cy.get('[name=elems]').type(81);

    })

})