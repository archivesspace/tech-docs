const editBaseUrl = 'https://github.com/archivesspace/tech-docs/edit/master/';
const issueBaseUrl =
  'https://github.com/archivesspace/tech-docs/issues/new?title=Problem+on+';

describe('Feedback', () => {
  it('includes an edit this page on GitHub link on every page', () => {
    let file = 'README.md';
    cy.visit('http://localhost:4000/');
    cy.get('a')
      .contains('Edit this page on GitHub')
      .should('have.attr', 'href', `${editBaseUrl}${file}`)
      .children()
      .should('have.text', file);

    file = 'readme_develop.md';
    cy.visit('http://localhost:4000/readme_develop');
    cy.get('a')
      .contains('Edit this page on GitHub')
      .should('have.attr', 'href', `${editBaseUrl}${file}`)
      .children()
      .should('have.text', file);
  });

  it('includes a report issue on GitHub link on every page', () => {
    let file = 'README.md';
    cy.visit('http://localhost:4000/');
    cy.get('a')
      .contains('Report issue on GitHub')
      .should('have.attr', 'href', `${issueBaseUrl}${file}`)
      .children()
      .should('have.text', file);

    file = 'readme_develop.md';
    cy.visit('http://localhost:4000/readme_develop');
    cy.get('a')
      .contains('Report issue on GitHub')
      .should('have.attr', 'href', `${issueBaseUrl}${file}`)
      .children()
      .should('have.text', file);
  });
});
