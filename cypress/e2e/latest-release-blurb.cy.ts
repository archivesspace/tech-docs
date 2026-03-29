import {
  GITHUB_API_LATEST_RELEASE,
  GITHUB_API_HEADERS
} from '@lib/constants.ts'

function expectedReleaseUrl(
  body: { html_url?: string },
  tagName: string
): string {
  if (typeof body.html_url === 'string' && body.html_url) {
    return body.html_url
  }

  return `https://github.com/archivesspace/archivesspace/releases/tag/${encodeURIComponent(tagName)}`
}

describe('Latest release blurb', () => {
  it('shows the latest release of ArchivesSpace', () => {
    cy.request({
      url: GITHUB_API_LATEST_RELEASE,
      headers: GITHUB_API_HEADERS
    }).then((response) => {
      expect(response.status).to.eq(200)

      const body = response.body

      expect(body.tag_name, 'tag_name').to.be.a('string').and.not.be.empty

      const tagName = body.tag_name as string
      const releaseUrl = expectedReleaseUrl(body, tagName)

      cy.visit('/administration/getting_started/')

      cy.get('p.latest-release-blurb').should(($p) => {
        const normalized = $p.text().replace(/\s+/g, ' ').trim()

        expect(normalized).to.eq(
          `The latest release of ArchivesSpace is ${tagName}.`
        )
      })

      cy.get('p.latest-release-blurb a')
        .should('have.attr', 'href', releaseUrl)
        .and('have.text', tagName)
    })
  })
})
