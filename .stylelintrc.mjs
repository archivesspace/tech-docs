/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recommended', 'stylelint-config-html/astro'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        // Ignore CSS Modules :global used in Astro components overridden herein
        ignorePseudoClasses: ['global']
      }
    ]
  }
}
