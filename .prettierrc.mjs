/**
 * @see https://prettier.io/docs/en/configuration.html
 * @see https://docs.astro.build/en/editor-setup/#prettier
 * @type {import('prettier').Config}
 */
export default {
  arrowParens: 'always',
  singleQuote: true,
  semi: false,
  trailingComma: 'none',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
}
