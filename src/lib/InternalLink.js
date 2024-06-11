import { basename } from 'node:path';

export default class InternalLink {
  relativePathRegex = /^(\.\/)/;
  parentDirectoryRegex = /^(\.\.\/)/;

  /**
   *
   * @param {string} href - the href attribute value of the internal link, ie: '../index.md'
   * @param {string} inputPath - file path of the document containing an internal link, the output
   * of 11ty's `inputPath` variable
   */
  constructor(href, inputPath) {
    this.href = href;
    this.inputPath = inputPath;
  }

  /**
   * @returns {string} - the new href attribute value for the internal link
   * @description - every href is cool uri'd, and if the source file containing
   * the internal link is not an index.md file then prepend a directory parent; this
   * accounts for all 8 possibilities given the three things we care about (source
   * file name, is href relative or directory parent, and is href target file name)
   */
  get newHref() {
    let newHref = this.coolUriIt(this.href);

    if (!this.inputIsIndex(this.inputPath)) {
      newHref = this.goUpALevel(newHref);
    }

    return newHref;
  }

  /**
   * @param {string} path - a relative href attribute value
   * @returns {string} - a "cool uri" that leaves out the document file extension for directory indexing
   */
  coolUriIt(path) {
    if (this.inputIsIndex(path)) {
      return path.replace('/index.md', '/');
    } else {
      return path.replace(/\.md$/, '/');
    }
  }

  /**
   * @param {string} path - a relative href attribute value
   * @returns {string} - prepends a directory parent to the href path
   */
  goUpALevel(path) {
    if (this.relativePathRegex.test(path)) {
      return path.replace(this.relativePathRegex, '../');
    } else if (this.parentDirectoryRegex.test(path)) {
      return path.replace(this.parentDirectoryRegex, '../../');
    }
  }

  /**
   * @param {string} path - a href attribute value or inputPath
   * @returns {boolean} - true if the path points to index.md
   */
  inputIsIndex(path) {
    return basename(path) === 'index.md';
  }
}
