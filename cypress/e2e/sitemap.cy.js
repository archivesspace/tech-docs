const indexPath = '/sitemap-index.xml'

describe('Sitemap', () => {
  if (Cypress.env('MODE') === 'production') {
    it('assets are present', () => {
      cy.request(indexPath)
      cy.request('/sitemap-0.xml')
    })

    it('includes blog URLs', () => {
      cy.request('/sitemap-0.xml').then((response) => {
        expect(response.body).to.include('/blog')
        expect(response.body).to.include('/blog/')
      })
    })
  }

  it('is linked from each page', () => {
    cy.visit('/')
    cy.get("link[rel='sitemap']").should('have.attr', 'href', indexPath)

    cy.visit('/architecture/jsonmodel')
    cy.get("link[rel='sitemap']").should('have.attr', 'href', indexPath)
  })
})
