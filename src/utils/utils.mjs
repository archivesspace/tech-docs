import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execPromise = promisify(exec)

/**
 * @returns {Promise<string>} The current branch and latest commit hash,
 * e.g. `${branch}-${commit}`
 */
export async function gitMetadata() {
  try {
    const { stdout, stderr } = await execPromise(
      'echo `git rev-parse --abbrev-ref HEAD 2>/dev/null`-`git rev-parse --short HEAD 2>/dev/null`'
    )

    if (stderr) {
      throw new Error(`Stderr: ${stderr}`)
    }

    return stdout.trim()
  } catch (error) {
    throw new Error(`Error: ${error.message}`)
  }
}

/**
 * Strip HTML tags from a string, matching valid-looking opening or closing tags
 * to avoid false positives like "x < 5 > y".
 *
 * Regex /<\/?[a-zA-Z][^>]*>/g:
 * - <     opening bracket
 * - \/?   optional slash (for closing tags like </em>)
 * - [a-zA-Z]  tag must start with letter (avoids "< 5>")
 * - [^>]*  rest of tag until >
 * - g     global (all matches)
 *
 * @param {unknown} s
 * @returns {string}
 */
export function stripHtml(s) {
  if (typeof s !== 'string') return ''

  return s.replace(/<\/?[a-zA-Z][^>]*>/g, '').trim()
}
