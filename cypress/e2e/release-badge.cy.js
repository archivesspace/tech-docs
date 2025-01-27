const releaseUrl =
  'https://github.com/archivesspace/archivesspace/releases/latest'
const title = 'Go to the latest ArchivesSpace release'
const badgeSrc = `https://img.shields.io/github/v/release/archivesspace/archivesspace?label=ArchivesSpace&color=007595`
const altText = 'The latest ArchivesSpace release version'

describe('Release Badge', () => {
  it('displays the release badge with the correct data in the header on desktop', () => {
    cy.visit('/')
    cy.get(
      '.page > header:first-child > div:first-child > div:nth-child(3) > a:first-child'
    )
      .should('have.attr', 'href', releaseUrl)
      .should('have.attr', 'title', title)
      .within(() => {
        cy.get('img')
          .should('have.attr', 'src', badgeSrc)
          .should('have.attr', 'alt', altText)
      })
  })

  it(
    'displays the release badge with the correct data in the mobile menu footer',
    { viewportWidth: 400 },
    () => {
      cy.visit('/')
      cy.get('button[aria-label="Menu"]').click()
      cy.get('#starlight__sidebar .mobile-preferences > a:first-child')
        .should('have.attr', 'href', releaseUrl)
        .should('have.attr', 'title', title)
        .within(() => {
          cy.get('img')
            .should('have.attr', 'src', badgeSrc)
            .should('have.attr', 'alt', altText)
        })
    }
  )
})
