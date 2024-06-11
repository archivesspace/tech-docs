import { parseHTML } from 'linkedom';
import InternalLink from './src/lib/InternalLink.js';

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'fonts' });
  eleventyConfig.addPassthroughCopy({ 'docs/images': 'images' });

  eleventyConfig.addGlobalData('layout', 'default.html');

  eleventyConfig.addTransform(
    'tranform-internal-links-for-html',
    async function (content, outputPath) {
      // TODO add this function to the InternalLink class as a static method
      if (!outputPath?.endsWith('.html')) {
        return content;
      }

      const inputPath = this.inputPath;
      const internalLinkRegex = /^(\.\/|\.\.\/)*.*\.md$/;
      const { document } = parseHTML(content);
      const internalLinks = Array.from(
        document.querySelectorAll('a[href]')
      ).filter((link) => internalLinkRegex.test(link.href));

      internalLinks.forEach((link) => {
        const il = new InternalLink(link.href, inputPath);
        link.setAttribute('href', il.newHref);
      });

      return document.documentElement.outerHTML;
    }
  );

  return {
    dir: {
      input: 'docs',
      includes: '../src/_includes',
      layouts: '../src/_layouts'
    }
  };
}
