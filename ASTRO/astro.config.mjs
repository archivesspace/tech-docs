import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.archivesspace.org',
  integrations: [
    starlight({
      title: 'ArchivesSpace Tech Docs',
      logo: {
        light: './src/assets/logo.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true
      },
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/archivesspace/tech-docs/edit/master/'
      },
      lastUpdated: true,
      social: {
        github: 'https://github.com/archivesspace/tech-docs',
        youtube: 'https://www.youtube.com/@archivesspace5340'
      },
      sidebar: [
        {
          label: 'Tech Docs',
          link: '/'
        }
      ]
    })
  ]
});
