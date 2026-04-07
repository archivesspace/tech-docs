import mermaid from 'mermaid'

type MermaidTheme = 'dark' | 'default'

let currentMermaidTheme: MermaidTheme = getMermaidTheme()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMermaid, {
    once: true
  })
} else {
  initializeMermaid()
}

document.addEventListener('astro:page-load', initializeMermaid)

const themeObserver = new MutationObserver(themeObserverHandler)

themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
})

function initializeMermaid() {
  currentMermaidTheme = getMermaidTheme()
  initializeMermaidRuntime(currentMermaidTheme)

  void renderMermaidDiagrams()
}

function getMermaidTheme(): MermaidTheme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default'
}

function initializeMermaidRuntime(theme: MermaidTheme) {
  const textColor = theme === 'dark' ? '#fff' : '#000'

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'antiscript',
    theme,
    themeVariables: {
      textColor,
      primaryTextColor: textColor
    }
  })
}

async function renderMermaidDiagrams() {
  const preBlocks = document.querySelectorAll('pre[data-language="mermaid"]')

  for (const pre of preBlocks) {
    if (!(pre instanceof HTMLElement)) continue
    if (pre.dataset.mermaidProcessed === 'true') continue

    const codeLines = pre.querySelectorAll('.ec-line .code')
    const definition =
      (codeLines.length > 0
        ? Array.from(codeLines)
            .map((line) => line.textContent ?? '')
            .join('\n')
        : pre.textContent) ?? ''
    const cleanedDefinition = definition.trim()
    if (!cleanedDefinition) continue

    const mermaidBlock = document.createElement('div')

    mermaidBlock.className = 'mermaid'
    mermaidBlock.textContent = cleanedDefinition
    mermaidBlock.dataset.mermaidDefinition = cleanedDefinition
    pre.dataset.mermaidProcessed = 'true'

    const wrapper = pre.closest('.expressive-code') ?? pre

    wrapper.replaceWith(mermaidBlock)
  }

  const diagrams = document.querySelectorAll<HTMLElement>(
    '.mermaid:not([data-processed])'
  )
  if (diagrams.length === 0) return

  await runMermaidOnNodes(diagrams)
}

function rerenderMermaidDiagramsForThemeChange() {
  const nextTheme = getMermaidTheme()
  if (nextTheme === currentMermaidTheme) return

  currentMermaidTheme = nextTheme
  initializeMermaidRuntime(currentMermaidTheme)

  const diagrams = document.querySelectorAll('.mermaid')

  for (const diagram of diagrams) {
    if (!(diagram instanceof HTMLElement)) continue

    const definition = diagram.dataset.mermaidDefinition
    if (!definition) continue

    diagram.textContent = definition
    diagram.removeAttribute('data-processed')
  }

  void runMermaidOnNodes(document.querySelectorAll('.mermaid'))
}

function runMermaidOnNodes(nodes: NodeListOf<HTMLElement> | HTMLElement[]) {
  return mermaid.run({
    nodes: Array.from(nodes)
  })
}

function themeObserverHandler(mutations: MutationRecord[]) {
  if (mutations.length === 0) return

  rerenderMermaidDiagramsForThemeChange()
}
