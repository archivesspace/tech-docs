module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'fonts' });

  eleventyConfig.addGlobalData('layout', 'default.html');

  return {
    dir: {
      input: 'docs',
      includes: '../src/_includes',
      layouts: '../src/_layouts'
    }
  };
};
