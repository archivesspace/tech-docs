describe('Sidebar', () => {
  it('shows git metadata only in development mode', () => {
    cy.visit('/')
    if (Cypress.env('MODE') === 'production') {
      cy.get('#starlight__sidebar > .sidebar-content > footer').should(
        'not.exist'
      )
    }
    if (Cypress.env('MODE') === 'development') {
      cy.get('#starlight__sidebar > .sidebar-content > footer')
    }
  })
})
