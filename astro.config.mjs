import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import sidebar from './src/siteNavigation.json'

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.archivesspace.org',
  integrations: [
    starlight({
      title: 'Tech Docs',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en'
        },
        de: { label: 'Deutsch' },
        es: { label: 'Español' },
        fr: { label: 'Français' },
        ja: { label: '日本語' }
      },
      routeMiddleware: './src/blogRouteData.js',
      logo: {
        dark: './src/images/logo-full-dark.svg',
        light: './src/images/logo-full-light.svg',
        replacesTitle: true
      },
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/archivesspace/tech-docs/edit/main/'
      },
      credits: true,
      lastUpdated: true,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/archivesspace/tech-docs'
        },
        {
          icon: 'youtube',
          label: 'YouTube',
          href: 'https://www.youtube.com/@archivesspace5340'
        }
      ],
      sidebar,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 5 },
      components: {
        EditLink: './src/components/overrides/EditLink.astro',
        PageFrame: './src/components/overrides/PageFrame.astro',
        PageTitle: './src/components/CustomPageTitle.astro',
        Footer: './src/components/overrides/Footer.astro',
        Header: './src/components/overrides/Header.astro',
        Sidebar: './src/components/overrides/Sidebar.astro',
        SocialIcons: './src/components/overrides/SocialIcons.astro'
      }
    })
  ]
})
