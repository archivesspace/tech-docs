describe('Home page', () => {
  it('shows the sidebar, custom HomePage component, and Starlight credits', () => {
    cy.visit('/')
    cy.get('#starlight__sidebar')
    cy.get('[data-is-homepage]')
    cy.get('footer').contains('Built with Starlight')
  })

  it('does not show a Table of Contents, edit page link, report issue link, and last updated date', () => {
    cy.visit('/')
    cy.get('.right-sidebar').should('not.exist')
    cy.get('footer').contains('Edit this page on GitHub').should('not.exist')
    cy.get('footer').contains('Report an issue on Jira').should('not.exist')
    cy.get('footer').contains('Last updated: ').should('not.exist')
  })
})
