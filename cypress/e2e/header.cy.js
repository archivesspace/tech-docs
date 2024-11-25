describe('Header', () => {
  it('links to ArchivesSpace.org alongside the Starlight SocialIcons', () => {
    cy.visit('/')
    cy.get(
      '.page > header:first-child .social-icons > a[href="https://archivesspace.org"]'
    )
  })
})
