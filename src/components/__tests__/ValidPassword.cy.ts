import ValidPassword from '../ValidPassword.vue';
import { i18n } from 'src/boot/i18n';

describe('ValidPassword', () => {
  it('Check english labels', () => {
    cy.mount(ValidPassword, {
      global: {
        plugins: [i18n],
      },
      props: {
        password: 'Abc1234',
      },
    });

    cy.dataCy('QCheckBoxLength').should('contain', 'Length >= 8');
    cy.dataCy('QCheckBoxLower').should('contain', 'Lowercase');
    cy.dataCy('QCheckBoxUpper').should('contain', 'Uppercase');
    cy.dataCy('QCheckBoxNumber').should('contain', 'Number(s)');
    cy.dataCy('QCheckBoxSpecial').should('contain', 'Special');
  });

  it('Check colors', () => {
    cy.mount(ValidPassword, {
      global: {
        plugins: [i18n],
      },
      props: {
        password: 'Abc1234',
      },
    });

    cy.dataCy('QCheckBoxLength').should('have.css', 'color', 'rgb(244, 67, 54)');
    cy.dataCy('QCheckBoxLower').should('have.css', 'color', 'rgb(76, 175, 80)');
    cy.dataCy('QCheckBoxUpper').should('have.css', 'color', 'rgb(76, 175, 80)');
    cy.dataCy('QCheckBoxNumber').should('have.css', 'color', 'rgb(76, 175, 80)');
    cy.dataCy('QCheckBoxSpecial').should('have.css', 'color', 'rgb(244, 67, 54)');
  });
});
