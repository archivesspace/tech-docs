const indexPath = '/sitemap-index.xml'

describe('Sitemap', () => {
  if (Cypress.env('MODE') === 'production') {
    it('assets are present', () => {
      cy.request(indexPath)
      cy.request('/sitemap-0.xml')
    })
  }

  it('is linked from each page', () => {
    cy.visit('/')
    cy.get("link[rel='sitemap']").should('have.attr', 'href', indexPath)

    cy.visit('/architecture/jsonmodel')
    cy.get("link[rel='sitemap']").should('have.attr', 'href', indexPath)
  })
})
