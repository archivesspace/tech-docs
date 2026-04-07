describe('Mermaid diagrams', () => {
  it('renders Mermaid code fences as SVG diagrams', () => {
    cy.visit('/about/authoring#diagrams')

    cy.get('.sl-markdown-content .mermaid').should('exist')
    cy.get('.sl-markdown-content .mermaid svg').should('be.visible')
    cy.get('.sl-markdown-content pre[data-language="mermaid"]').should(
      'not.exist'
    )
  })
})
