const editBaseUrl = 'https://github.com/archivesspace/tech-docs/edit/master/';
const issuesUrl =
  'https://archivesspace.atlassian.net/jira/software/projects/TD/issues';

describe('Feedback', () => {
  it('includes an edit this page on GitHub link on every page', () => {
    const editText = 'Edit this page on GitHub';
    let file = 'README.md';

    cy.visit('http://localhost:4000/');
    cy.get('a')
      .contains(editText)
      .should('have.attr', 'href', `${editBaseUrl}${file}`)
      .children()
      .should('have.text', file);

    file = 'readme_develop.md';
    cy.visit('http://localhost:4000/readme_develop');
    cy.get('a')
      .contains(editText)
      .should('have.attr', 'href', `${editBaseUrl}${file}`)
      .children()
      .should('have.text', file);
  });

  it('includes a report issue on Jira link on every page', () => {
    const reportText = 'Report issue on Jira';
    let file = 'README.md';

    cy.visit('http://localhost:4000/');
    cy.get('a')
      .contains(reportText)
      .should('have.attr', 'href', `${issuesUrl}`)
      .children()
      .should('have.text', file);

    file = 'readme_develop.md';
    cy.visit('http://localhost:4000/readme_develop');
    cy.get('a')
      .contains(reportText)
      .should('have.attr', 'href', `${issuesUrl}`)
      .children()
      .should('have.text', file);
  });
});
