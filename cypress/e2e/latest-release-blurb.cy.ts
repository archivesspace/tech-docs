import { LATEST_AS_RELEASE } from '@lib/latestArchivesSpaceRelease.ts'

describe('Latest release blurb', () => {
  it('shows the latest release of ArchivesSpace', () => {
    cy.visit('/administration/getting_started/')

    cy.get('p.latest-release-blurb').should(($p) => {
      const normalized = $p.text().replace(/\s+/g, ' ').trim()

      expect(normalized).to.eq(
        `The latest release of ArchivesSpace is ${LATEST_AS_RELEASE.tagName}.`
      )
    })

    cy.get('p.latest-release-blurb a')
      .should('have.attr', 'href', LATEST_AS_RELEASE.htmlUrl)
      .and('have.text', LATEST_AS_RELEASE.tagName)
  })
})
