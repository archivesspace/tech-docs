describe('Header', () => {
  it('links to ArchivesSpace.org alongside the Starlight SocialIcons', () => {
    cy.visit('/')
    cy.get(
      '.page > header:first-child .social-icons > a[href="https://archivesspace.org"]'
    )
  })

  it('has blog link with correct href', () => {
    cy.visit('/')
    cy.get('a.blog-nav-link')
      .should('have.attr', 'href', '/blog')
      .and('not.have.class', 'active')
      .and('contain', 'Blog')
  })

  it('shows blog link as active on blog index', () => {
    cy.visit('/blog')
    cy.get('a.blog-nav-link.active')
  })

  it('shows blog link as active on blog post', () => {
    cy.visit('/blog/v4-2-0-release-candidate')
    cy.get('a.blog-nav-link.active')
  })
})
