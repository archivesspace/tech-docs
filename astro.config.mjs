import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import sidebar from './src/siteNavigation.json'

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.archivesspace.org',
  integrations: [
    starlight({
      title: 'Tech Docs',
      logo: {
        light: './src/images/logo.svg',
        dark: './src/images/logo-dark.svg',
        replacesTitle: true
      },
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/archivesspace/tech-docs/edit/main/'
      },
      credits: true,
      lastUpdated: true,
      social: {
        github: 'https://github.com/archivesspace/tech-docs',
        youtube: 'https://www.youtube.com/@archivesspace5340'
      },
      sidebar,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      components: {
        Footer: './src/components/overrides/Footer.astro',
        Header: './src/components/overrides/Header.astro',
        MobileMenuFooter: './src/components/overrides/MobileMenuFooter.astro',
        Sidebar: './src/components/overrides/Sidebar.astro',
        SocialIcons: './src/components/overrides/SocialIcons.astro'
      }
    })
  ]
})
