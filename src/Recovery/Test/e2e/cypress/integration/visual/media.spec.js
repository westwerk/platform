/// <reference types="Cypress" />

import MediaPageObject from '../../support/pages/module/sw-media.page-object';
import ProductPageObject from "../../support/pages/module/sw-product.page-object";

describe('Media: Visual tests', () => {
    beforeEach(() => {
        cy.loginViaApi()
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/media/index`);
            });
    });

    it('@visual: check appearance of basic media workflow', () => {
        const page = new MediaPageObject();

        // Request we want to wait for later
        cy.server();
        cy.route({
            url: `api/v*/_action/media/**/upload?extension=png&fileName=sw-login-background`,
            method: 'post'
        }).as('saveDataFileUpload');

        page.uploadImageUsingFileUpload('img/sw-login-background.png', 'sw-login-background.png');

        let notification = Cypress.env('locale') === 'en-GB' ?
            'File has been saved' : 'Eine Datei erfolgreich gespeichert';
        cy.wait('@saveDataFileUpload').then((xhr) => {
            cy.awaitAndCheckNotification(notification);
            expect(xhr).to.have.property('status', 204);
        });
        cy.get('.sw-media-base-item__name[title="sw-login-background.png"]')
            .should('be.visible');

        // Take snapshot for visual testing
        cy.takeSnapshot('Media listing', '.sw-media-library');
    });
});