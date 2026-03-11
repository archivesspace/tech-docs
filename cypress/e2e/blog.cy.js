describe('Blog', () => {
  describe('index page', () => {
    it('shows blog structure', () => {
      cy.visit('/blog')
      cy.get('.blog-post-list')
      cy.get('.blog-index-header')
      cy.get('.blog-post-card')
        .first()
        .within(() => {
          cy.get('.blog-post-card__meta')
          cy.get('.blog-post-card__title a')
          cy.get('.blog-post-card__teaser')
          cy.get('.blog-post-card__read-more')
        })
    })

    it('omits sidebars and docs footer elements', () => {
      cy.visit('/blog')
      cy.get('#starlight__sidebar').should('be.not.visible')
      cy.get('.right-sidebar').should('not.exist')
      cy.get('footer').contains('Edit this page on GitHub').should('not.exist')
      cy.get('footer').contains('Report an issue on Jira').should('not.exist')
      cy.get('footer').contains('Last updated: ').should('not.exist')
    })

    it('post title and Read more link navigate to same post', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card')
        .first()
        .within(($card) => {
          cy.get('.blog-post-card__title a')
            .should('have.attr', 'href')
            .and('include', '/blog/')
          cy.get('.blog-post-card__title a')
            .invoke('attr', 'href')
            .then((titleHref) => {
              cy.get('.blog-post-card__read-more').should(
                'have.attr',
                'href',
                titleHref
              )
            })
        })
      cy.get('.blog-post-card__read-more').first().click()
      cy.url().should('match', /\/blog\/[\w-]+$/)
      cy.get('.blog-post-header')
    })
  })

  describe('post page', () => {
    it('shows custom header with BackToBlog', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card__title a').first().click()
      cy.get('.blog-post-header')
      cy.get('.back-to-blog').should('have.attr', 'href', '/blog')
      cy.get('.blog-post-header h1')
      cy.get('.blog-post-header .blog-post-header__meta time')
      cy.get('.blog-post-header .authors')
    })

    it('omits sidebars and docs footer elements', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card__title a').first().click()
      cy.get('#starlight__sidebar').should('not.be.visible')
      cy.get('.right-sidebar').should('not.exist')
      cy.get('footer').contains('Edit this page on GitHub').should('not.exist')
      cy.get('footer').contains('Report an issue on Jira').should('not.exist')
      cy.get('footer').contains('Last updated: ').should('not.exist')
    })

    it('BackToBlog navigates to blog index', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card__title a').first().click()
      cy.get('.back-to-blog').click()
      cy.url().should('include', '/blog')
    })
  })

  describe('pagination', () => {
    it('newest post has Previous link and no Next', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card__title a').then(($links) => {
        const prevHref = $links.eq(1).attr('href')
        cy.get('.blog-post-card__title a').first().click()
        cy.get(`footer a[href="${prevHref}"]`).should('exist')
        cy.get('footer a[href*="/blog/"]').should('have.length', 1)
      })
    })

    it('middle post has both Previous and Next', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card__title a').then(($links) => {
        cy.wrap($links.eq(1)).click()
      })
      cy.get('footer a[href*="/blog/"]').should('have.length', 2)
    })

    it('oldest post has Next link and no Previous', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card__title a').then(($links) => {
        const nextHref = $links.eq($links.length - 2).attr('href')
        cy.wrap($links.last()).click()
        cy.get(`footer a[href="${nextHref}"]`).should('exist')
        cy.get('footer a[href*="/blog/"]').should('have.length', 1)
      })
    })

    it('pagination links navigate correctly', () => {
      cy.visit('/blog')
      cy.get('.blog-post-card__title a').then(($links) => {
        const newestHref = $links.eq(0).attr('href')
        const middleHref = $links.eq(1).attr('href')
        cy.wrap($links.eq(1)).click()
        cy.get(`footer a[href="${newestHref}"]`).click()
        cy.url().should('match', /\/blog\/[\w-]+$/)
        cy.get(`footer a[href="${middleHref}"]`).click()
        cy.url().should('match', /\/blog\/[\w-]+$/)
      })
    })
  })

  describe('DocsPointer', () => {
    context('viewport >= 50rem', () => {
      beforeEach(() => {
        cy.viewport(800, 660)
      })

      it('is visible on blog index with arrow and docs label', () => {
        cy.visit('/blog')
        cy.get('.docs-pointer')
          .should('be.visible')
          .within(() => {
            cy.get('.docs-pointer__arrow').contains('⤶')
            cy.get('.docs-pointer__label').contains('docs')
          })
      })

      it('is visible on blog post', () => {
        cy.visit('/blog')
        cy.get('.blog-post-card__title a').first().click()
        cy.get('.docs-pointer').should('be.visible')
      })
    })

    context('viewport < 50rem', () => {
      beforeEach(() => {
        cy.viewport(799, 660)
      })

      it('is not visible on blog index', () => {
        cy.visit('/blog')
        cy.get('.docs-pointer').should('exist').and('not.be.visible')
      })

      it('is not visible on blog post', () => {
        cy.visit('/blog')
        cy.get('.blog-post-card__title a').first().click()
        cy.get('.docs-pointer').should('exist').and('not.be.visible')
      })
    })
  })

  describe('mobile sidebar', () => {
    beforeEach(() => {
      cy.viewport(799, 660)
    })

    it(
      'shows hamburger menu and sidebar on blog index',
      { viewportWidth: 799 },
      () => {
        cy.visit('/blog')
        cy.get('button[aria-label="Menu"]').should('exist')
        cy.get('button[aria-label="Menu"]').click()
        cy.get('#starlight__sidebar').should('be.visible')
      }
    )

    it(
      'shows hamburger menu and sidebar on blog post',
      { viewportWidth: 799 },
      () => {
        cy.visit('/blog')
        cy.get('.blog-post-card__title a').first().click()
        cy.get('button[aria-label="Menu"]').should('exist')
        cy.get('button[aria-label="Menu"]').click()
        cy.get('#starlight__sidebar').should('be.visible')
      }
    )
  })
})
