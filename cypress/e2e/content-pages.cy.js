describe('Content pages', () => {
  it('show the sidebar, table of contents, and footer meta and pagination sections', () => {
    cy.visit('/architecture/jsonmodel')
    const firstPage = cy.url()
    cy.get('#starlight__sidebar')
    cy.get('.right-sidebar')
    cy.get('footer a').contains('Edit this page on GitHub')
    cy.get('footer a').contains('Report an issue on Jira')
    cy.get('footer p').contains('Last updated: ')
    cy.get('footer a').contains('Previous')
    cy.get('footer a').contains('Next').click()

    cy.url() !== firstPage
    cy.get('#starlight__sidebar')
    cy.get('.right-sidebar')
    cy.get('footer a').contains('Edit this page on GitHub')
    cy.get('footer a').contains('Report an issue on Jira')
    cy.get('footer p').contains('Last updated: ')
    cy.get('footer a').contains('Previous')
    cy.get('footer a').contains('Next')
  })
})
